import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject } from 'rxjs';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { SuccessDialogComponent } from 'src/app/core/dialogs/success-dialog/success-dialog.component';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidatorService } from 'src/app/core/services/validator.service';
import { UserRightAccess } from './user-right-access.model';

@Component({
  selector: 'vex-user-right-access',
  templateUrl: './user-right-access.component.html',
  styleUrls: ['./user-right-access.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})

export class UserRightAccessComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  layoutCtrl = new UntypedFormControl('boxed');
  dataSource: MatTableDataSource<UserRightAccess> | null;
  selection = new SelectionModel<UserRightAccess>(true, []);
  searchCtrl = new UntypedFormControl();
  subject$: ReplaySubject<UserRightAccess[]> = new ReplaySubject<UserRightAccess[]>(1);
  userRightAccess: UserRightAccess[];

  filterForm: FormGroup;
  userRoleArray = [];
  userTypeArray = [];
  subUserTypeArray = [];
  newPagesAccArray = [];
  projectTypeArray = [];
  readWriteFNFlag: boolean = false;
  readFNFlag: boolean = false;
  dropDownSelFlag: boolean = true;
  defaultCallTableFlag: boolean = true;
  totalPages:number;
  totalRows: number = 0;

  @Input()
  pageNumber: number = 1;
  columns: TableColumn<UserRightAccess>[] = [
    { label: 'Sr.No', property: 'srNo', type: 'button', visible: true },
    { label: 'Page ID', property: 'pageId', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Page URL', property: 'pageURL', type: 'text', visible: true },
    { label: 'Page Name', property: 'pageName', type: 'text', visible: true },
    { label: 'Read Only',  property: 'readOnly', type: 'button', visible: true },
    { label: 'Read And Write', property: 'readWrite', type: 'button', visible: true },
  ];

  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize = 10;

  constructor(
    public dialog: MatDialog,
    private apiService: ApiService, 
    private masterService: MasterService,
    public commonService: CommonService,
    private fb: FormBuilder,
    private error: ErrorsService,
    private localstorageService: LocalstorageService,
    public validatorService:ValidatorService,
    private ngZone: NgZone
  ) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {
    this.defultForm();
    this.getprojectType();
  }

  defultForm() {
    this.filterForm = this.fb.group({
      projectId: [''],
      userType: [''],
      subUserType: [''],
      level: [''],
      search: ['']
    });
  }

  // ............................bind data to all dropdown...................................*/

  getprojectType() {
    this.masterService.getProjectId().subscribe({
      next: (response: any) => {
        this.projectTypeArray = response;
        this.projectTypeArray.length == 1 || this.dropDownSelFlag ? (this.filterForm.controls['projectId'].setValue(this.projectTypeArray[0]?.id), this.getuserType()) : '';
      },
      error: (err => { this.error.handelError(err) })
    })
  }

  getuserType() {
    this.subUserTypeArray = [];
    this.masterService.getUserType().subscribe({
      next: (response: any) => {
        this.userTypeArray = response;
        this.userTypeArray.length == 1 || this.dropDownSelFlag ? (this.filterForm.controls['userType'].setValue(this.userTypeArray[0].userTypeId), this.getsubUserType()) : '';
      },
      error: (err => { this.error.handelError(err) })
    })
  }

  getsubUserType() {
    this.subUserTypeArray = [];
    const userTypeId = this.filterForm.value.userType;
    const projectId = this.filterForm.value.projectId;
    this.masterService.getSubuserType(userTypeId, projectId).subscribe({
      next: (response: any) => {
        this.subUserTypeArray = response;
        this.subUserTypeArray.length == 1 || this.dropDownSelFlag ? (this.filterForm.controls['subUserType'].setValue(this.subUserTypeArray[0].subUserTypeId), this.getRole()) : '';
      }
    });
  }

  getRole() {
    let fromData = this.filterForm.value;
    this.masterService.getUserRole(fromData.userType, fromData.projectId).subscribe({
      next: (response: any) => {
        this.userRoleArray = response;
        if (this.userRoleArray.length == 1 || this.dropDownSelFlag) {
          this.filterForm.controls['level'].setValue(this.userRoleArray[0].roleId);
          this.defaultCallTableFlag ? this.getData() : '';
        }
      },
      error: (err => { this.error.handelError(err) })
    })
  }

// ........................Bind Api data to table ................................. */

  bindTable() {
    let formValue = this.filterForm.value;
    if (this.commonService.checkDataType(formValue.projectId) == false) {
      this.commonService.snackBar('Please select project', 1)
      return
    } else if (this.commonService.checkDataType(formValue.userType) == false) {
      this.commonService.snackBar('Please select user type', 1)
      return
    } else if (this.commonService.checkDataType(formValue.subUserType) == false) {
      this.commonService.snackBar('Please select sub user type', 1)
      return
    } else if (this.commonService.checkDataType(formValue.level) == false) {
      this.commonService.snackBar('Please select role type', 1)
      return
    }
   
    let paramList: string = "?ProjectId=" + formValue.projectId + "&UserTypeId=" + formValue.userType + "&SubUserTypeId=" + formValue.subUserType + "&RoleId=" + formValue.level + "&DesignationId=0&pageno=" + this.pageNumber + "&pagesize=" + 10 + "&Textsearch=" + formValue.search;
    this.apiService.setHttp('get', "user-pages/GetByCriteria" + paramList, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.totalRows > 10 && this.pageNumber==1 ? this.paginator.firstPage() : '';
          this.dataSource = new MatTableDataSource(res.responseData.responseData1);
          this.dataSource.sort = this.sort;
          this.totalRows = res.responseData.responseData2[0].pageCount;
        } else {
          this.dataSource = null         
          this.totalRows = 0;
          if (res.statusCode != "404") {
            this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
          }
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }

  getData() {
    this.pageNumber = 1;
    this.bindTable();
  }

  clear() {
    this.dropDownSelFlag = true;
    this.defaultCallTableFlag = true;
    this.bindTable();
  }

  // ...............................give page Access read only and readwrite.....................................*/

  addPageAccess() {
    if (this.newPagesAccArray.length == 0) {
      this.commonService.snackBar('Please select at least a page ', 1)
      return
    }
    this.apiService.setHttp('POST', "user-pages", false, JSON.stringify(this.newPagesAccArray), false, 'masterUrl');
     this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.ngZone.run(() => {
            this.pageNumber != 1 ?  this.paginator.pageIndex = this.pageNumber  : this.getData();
          });
          this.commonService.snackBar(res.statusMessage, 0);
        } else {
          if (res.statusCode != "404") {
            this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
          }
        }
      },
      error: (err: any) => { this.error.handelError(err) }
    })
  }

  opensucessDialog() {
    this.dialog.open(SuccessDialogComponent, {
      width: '340px',
      // data:'',
      data: { p1: 'User acess  successfully .', p2: '', cardTitle: 'Congratulations', successBtnText: 'Ok', dialogIcon: '', cancelBtnText: '' },

    })
  }

  // ........................ show and hide column in table ................................. */

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  onLabelChange(change: MatSelectChange, row: UserRightAccess) {
    const index = this.userRightAccess.findIndex(c => c === row);
    this.userRightAccess[index].labels = change.value;
    this.subject$.next(this.userRightAccess);
  }

  // .................................. Paginator method ................................. */

  pageChanged(event: any) {
    this.pageNumber = event.pageIndex + 1;
    this.bindTable();
  }

  // ..........................methods for checkbox change value...........................*/

  readOnlyFN(event: any, element: any, _flag: string) {
    event.checked == true ? this.readFNFlag = true : this.readFNFlag = false;
    this.addDataInArray(element)
  }
  readWriteFN(event: any, element: any, _flag: string) {
    event.checked == true ? this.readWriteFNFlag = true : this.readWriteFNFlag = false;
    this.addDataInArray(element)
  }

  // .......................checkebox checked and push data in array...............................*/

  addDataInArray(data: any) {
    let fromData: any = this.filterForm.value;
    let obj: any =
    {
      "id": data?.pageId,
      "userTypeId": fromData.userType,
      "pageId": data?.pageId,
      "readRight": this.readFNFlag,
      "writeRight": this.readWriteFNFlag,
      "isDeleted": false,
      "createdBy": this.localstorageService.userId(),
      "createdDate": new Date,
      "subUserTypeId": fromData.subUserType,
      "roleId": fromData.level,
      "designationId": 0,
      "projectId": fromData.projectId
    }
    let findObj = this.commonService.someOfArrayObject(this.newPagesAccArray, 'pageId', obj.pageId);
    let arrayIndex = this.commonService.findIndexOfArrayObject(this.newPagesAccArray, 'pageId', obj?.pageId);
    findObj ? this.newPagesAccArray[arrayIndex] = obj : this.newPagesAccArray.push(obj);
  }

  clearDropdown(flag: any) {
    this.dropDownSelFlag = false;
    this.defaultCallTableFlag = false;
    switch (flag) {
      case 'userType':
        this.filterForm.controls['userType'].setValue('');
        this.filterForm.controls['subUserType'].setValue(0);
        this.filterForm.controls['level'].setValue('');
        break;
      case 'subUserType':
        this.filterForm.controls['subUserType'].setValue(0);
        this.filterForm.controls['level'].setValue('');
        break;
      case 'level':
        this.filterForm.controls['level'].setValue('');
        break;
      default:
    }
  }

}
