import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
//@ts-ignore
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { ConfirmationDialogComponent } from 'src/app/core/dialogs/confirmation-dialog/confirmation-dialog.component';
import { SuccessDialogComponent } from 'src/app/core/dialogs/success-dialog/success-dialog.component';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { MasterService } from 'src/app/core/services/master.service';
import { AddUserComponent } from './add-user/add-user.component';
import { UserRegistration } from './user-registration.model';

@Component({
  selector: 'vex-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class UserRegistrationComponent implements OnInit,OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  layoutCtrl = new UntypedFormControl('boxed');
  selection = new SelectionModel<UserRegistration>(true, []);
  searchCtrl = new UntypedFormControl();
  dataSource: MatTableDataSource<UserRegistration> | null;
  userRegistration: UserRegistration[];
  subject$: ReplaySubject<UserRegistration[]> = new ReplaySubject<UserRegistration[]>(1);

  @Input()
  columns: TableColumn<UserRegistration>[] = [
    { label: 'Sr.No', property: 'srNo', type: 'button', visible: true,cssClasses: ['text-secondary', 'font-medium']  },
    { label: 'Name', property: 'name', type: 'text', visible: true },
    { label: 'Role', property: 'roleType', type: 'text', visible: true ,cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Mobile', property: 'mobileNo', type: 'text', visible: true ,cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'User Type', property: 'userType', type: 'text', visible: true ,cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Sub User Type', property: 'subUserType', type: 'text', visible: true,cssClasses: ['text-secondary', 'font-medium']  },
    { label: 'DSC Status', property: 'isDsc', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium']  },
    { label: 'Block /Unblock', property: 'isBlock', type: 'button', visible: true ,cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true ,cssClasses: ['text-secondary', 'font-medium'] },
  ];

  filterForm!: FormGroup;
  totalRows: number;
  subscription!: Subscription;
  divisionArray = [];
  stateArray = [];
  districtArray = [];
  dropDownSelFlag: boolean = true;
  talukaArray = [];
  defaultCallTableFlag: boolean = true;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize = 10;
  pageNumber: number = 1;
  constructor(public dialog: MatDialog,
    private apiService: ApiService, private fb: FormBuilder,
    public commonService: CommonService,
    private localstorageService: LocalstorageService,
    private error: ErrorsService,
    private masterService: MasterService,
    public configService: ConfigService) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }



  ngOnInit(): void {
    this.defultFilterform()
    this.getData();
  }

  defultFilterform() {
    this.filterForm = this.fb.group({
      stateId: [],
      divisionId: [0],
      districtId: [0],
      talukaId: [0],
      search: [''],
    });
    this.getstateData()
  }

  /** Whether the number of selected elements matches the total number of rows. */
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

  onLabelChange(change: MatSelectChange, row: UserRegistration) {
    const index = this.userRegistration.findIndex(c => c === row);
    this.userRegistration[index].labels = change.value;
    this.subject$.next(this.userRegistration);
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  // table data //
  getData() {
    let formValue = this.filterForm.value;
    let paramList: string = "?StateId=" + 0 + "&DivisionId=" + 0 + "&SubDivisionId=0&DistrictId=" + 0 + "&TalukaId=" + 0 + "&pageno=" + this.pageNumber + "&pagesize=" + this.pageSize
    this.commonService.checkDataType(formValue.search) == true ? paramList += "&Textsearch=" + formValue.search : '';
    this.apiService.setHttp('get', "user-registration/GetAll" + paramList, false, false, false, 'masterUrl');
    this.subscription = this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.dataSource = new MatTableDataSource(res.responseData.responseData1);
          this.dataSource.sort = this.sort;
          this.totalRows = res.responseData.responseData2.pageCount;

          this.totalRows > 10 && this.pageNumber == 1 ? this.paginator?.firstPage() : '';
        } else {
          this.dataSource = null;
          if (res.statusCode != "404") {
            this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
          }
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }

  // pagination code start here //
  pageChanged(event: any) {
    this.pageNumber = event.pageIndex + 1;
    this.getData();
  }

  //**  Confiramation for delete and block and unblock user */
  takeConfiramation(ele: UserRegistration[], flag: string, event?: any) {
    let title: string = 'Delete';
    let dialogText: string = 'Are you sure you want to delete this record ?';
    flag == 'block' ? event.checked == true ? (title = 'User Block', dialogText = 'Do you want to User Block') : (title = 'User Unblock', dialogText = 'Do you want to User Unblock') : ''
    const dialog = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: { p1: dialogText, p2: '', cardTitle: title, successBtnText: 'Yes', dialogIcon: '', cancelBtnText: 'No' },
      disableClose: this.apiService.disableCloseFlag,
    })
    dialog.afterClosed().subscribe(res => {
      if (res == 'Yes') {
        flag == 'block' ? this.userBlockUnBlock(ele, event.checked) : this.deleteUser(ele)
      } else {
        flag == 'block' ? !event.checked ? event.source.checked = true : event.source.checked = false : ''
      }
    })
  }

  // ---------------------- delete code start here ----------//
  deleteUser(ele: any) {
    let obj = {
      "id": ele.id,
      'deletedBy': this.localstorageService.userId(),
    }
    this.apiService.setHttp('DELETE', "user-registration", false, JSON.stringify(obj), false, 'masterUrl');
    this.subscription = this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.commonService.snackBar(res.statusMessage, 0);
          this.getData();
        } else {
          if (res.statusCode != "404") {
            this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
          }
        }
      },
      error: (err: any) => { this.error.handelError(err) }
    })

    this.selection.deselect(ele);
    this.subject$.next(this.userRegistration);
  }
  //------------- delete code end here ------------------//

  // ------------- user block and unblock -----------------//
  userBlockUnBlock(element: any, event: any) {
    let obj = {
      "id": element?.id,
      "isBlock": event == true ? true : false,
      "blockDate": new Date(),
      "blockBy": this.localstorageService.userId(),
      "blockRemark": ""
    }
    this.apiService.setHttp('PUT', "user-registration/BlockUnblockUser", false, JSON.stringify(obj), false, 'masterUrl');
    this.subscription = this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.getData();
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
  // ------------- user block and unblock End  -----------------//
  // --------- filter code  start------------------//
  filterData() {
    this.pageNumber = 1;
    this.getData();
  }

  //........ get state Array .....//
  getstateData() {
    this.stateArray = [];
    this.subscription = this.masterService.getState().subscribe({
      next: (response: any) => {
        let stateArray = response;
        stateArray.length > 1 ? this.stateArray.push({ state: "All State", id: 0 }, ...response) : this.stateArray = response;
        stateArray.length == 1 || this.dropDownSelFlag ? (this.filterForm.controls['stateId'].setValue(this.apiService.stateId), this.getDivision(this.apiService.stateId)) : '';
      },
      error: (err => { this.error.handelError(err) })
    })
  }

  //........ Division Array ......//
  getDivision(stateId: number) {
    this.divisionArray = [];
    this.subscription = this.masterService.getDivisionByStateId(stateId || 0).subscribe({
      next: (response: any) => {
        let divisionArray = response;
        divisionArray.length > 1 ? this.divisionArray.push({ id: 0, division: "All Division" }, ...response) : this.divisionArray = response;
        divisionArray.length == 1 || this.dropDownSelFlag ? (this.filterForm.controls['divisionId'].setValue(this.divisionArray[0].id), this.getDistrict(this.divisionArray[0].id)) : '';
      },
      error: (err => { this.error.handelError(err) })
    })
  }

  //....... get distrcit  array ..... //
  getDistrict(divId: any) {
    console.log(divId)
    this.districtArray = [];
    this.subscription = this.masterService.getDistrictByDivisionId(divId || 0).subscribe({
      next: (response: any) => {
        let districtArray = response;
        districtArray.length > 1 ? this.districtArray.push({ id: 0, district: "All District" }, ...response) : this.districtArray = response;
        districtArray.length == 1 || this.dropDownSelFlag ? (this.filterForm.controls['districtId'].setValue(this.districtArray[0].id), this.getTaluka(this.districtArray[0].id)) : '';
      },
      error: (err => { this.error.handelError(err) })
    })
  }

  //......... get taluka Array ......//

  getTaluka(districtId: any) {
    this.talukaArray = [];
    this.subscription = this.masterService.getTaluka(districtId || 0).subscribe({
      next: (response: any) => {
        let talukaArray = response;
        talukaArray.length > 1 ? this.talukaArray.push({ id: 0, taluka: "All Taluka" }, ...response) : this.talukaArray = response;
        talukaArray.length == 1 || this.dropDownSelFlag ? (this.filterForm.controls['districtId'].setValue(this.talukaArray[0].id)) : '';

      },
      error: (err => { this.error.handelError(err) })
    })
  }
  //...... Drop Down clear  ........//
  clearDropdown(flag: string) {
    this.defaultCallTableFlag = false;
    this.dropDownSelFlag = false;
    switch (flag) {
      case 'state':
        this.filterForm.controls['divisionId'].setValue(0);
        this.filterForm.controls['districtId'].setValue(0);
        this.filterForm.controls['talukaId'].setValue(0);
        break;
      case 'division':
        this.filterForm.controls['districtId'].setValue(0);
        this.filterForm.controls['talukaId'].setValue(0);
        break;
      case 'district':
        this.filterForm.controls['talukaId'].setValue(0);
        break;
      default:
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

//--------- add update user code start here ----------------//
  userCreateUpdate(data?:any): void {
    //@ts-ignore
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: 'auto',
      disableClose: false,
      data:data,
    });
    dialogRef.afterClosed().subscribe(result => {     
      if (result?.statusCode == 200 && result?.formType != 'PUT') {
        this.successDialog();
      } else if (result?.statusCode == 200 && result?.formType == 'PUT') {
        this.getData();
      }
    });

  }

  // sucess dialog 
  successDialog() {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {      
      width: this.apiService.modalSize[1],
      data: { p1: 'Added User Successfully.', p2: '', cardTitle: '', successBtnText: 'Ok', dialogIcon: '', cancelBtnText: '' },
      disableClose: this.apiService.disableCloseFlag,
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res == 'Yes') {
        this.filterData();
      }
    });
  }
}
