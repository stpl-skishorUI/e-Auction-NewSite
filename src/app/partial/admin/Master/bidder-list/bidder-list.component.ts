
import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject, Subscription } from 'rxjs';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { MasterService } from 'src/app/core/services/master.service';
import { UserRegistration } from '../user-registration/user-registration.model';
import { AddBidderComponent } from './add-bidder/add-bidder.component';

@Component({
  selector: 'vex-bidder-list',
  templateUrl: './bidder-list.component.html',
  styleUrls: ['./bidder-list.component.scss'],
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
export class BidderListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  layoutCtrl = new UntypedFormControl('boxed');
  selection = new SelectionModel<UserRegistration>(true, []);
  searchCtrl = new UntypedFormControl();
  dataSource: MatTableDataSource<UserRegistration> | null;
  userRegistration: UserRegistration[];
  subject$: ReplaySubject<UserRegistration[]> = new ReplaySubject<UserRegistration[]>(1);
  subscription!: Subscription;
  districtArray = new Array;

  @Input()
  pageNumber: number = 1;
  columns: TableColumn<UserRegistration>[] = [
    { label: 'Sr.No', property: 'srNo', type: 'button', visible: true },
    { label: 'Name', property: 'name', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Role', property: 'roleType', type: 'text', visible: true },
    { label: 'Mobile', property: 'mobileNo', type: 'text', visible: true },
    { label: 'User Type', property: 'userType', type: 'text', visible: true },
    { label: 'Sub User Type', property: 'subUserType', type: 'text', visible: true },
    { label: 'DSC Status', property: 'isDsc', type: 'button', visible: true, cssClasses: ['text-center'] },
    { label: 'Block /Unblock', property: 'isBlock', type: 'button', visible: true },
    { label: 'Actions', property: 'actions', type: 'button', visible: true },
  ];

  filterForm!: FormGroup;
  totalRows: number;

  constructor(public dialog: MatDialog,
    private apiService: ApiService, private fb: FormBuilder,
    public commonService: CommonService,
    private localstorageService:LocalstorageService,
    private error: ErrorsService, private masterService:MasterService) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize = 10;

  ngOnInit(): void {
    this.defultFilterform();
    this.getDistrict();
    this.getData();
  }

  defultFilterform() {
    this.filterForm = this.fb.group({
      districtId: [0],
      search: [''],
      bidderType: ['All'],
    });
  }

  getDistrict() {
    this.masterService.getDistrict(0).subscribe({
      next: (response: any) => {
        this.districtArray.push({ 'district': "All District", 'id': 0 }, ...response);
        console.log(this.districtArray);
      },
      error: (err => { this.error.handelError(err) })
    })
  }

  getData() {
    let localstorData = this.localstorageService.getLoggedInLocalstorageData().responseData;
    let formValue = this.filterForm.value;
    let bidderTy = formValue.bidderType == 'All' ? '' : formValue.bidderType;
    let obj = "StateId=" + localstorData?.stateId + "&DivisionId=" + localstorData?.divisionId + "&DistrictId=" + formValue.districtId +
      "&BidderType=" + bidderTy + "&ProjectId=" + localstorData?.projectId + "&pageno=" + this.pageNumber + "&pagesize=" + 10;
    this.commonService.checkDataType(formValue.search) == true ? obj += "&Textsearch=" + formValue.search : '';
    this.apiService.setHttp('get', "user-registration/GetBidderUsers?" + obj, false, false, false, 'masterUrl');
    this.subscription = this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.dataSource = new MatTableDataSource(res.responseData.responseData1);
          this.dataSource.sort = this.sort;
          this.totalRows = res.responseData.responseData2.pageCount;
          this.totalRows > 10 && this.pageNumber == 1 ? this.paginator?.firstPage() : '';
        } else {
          this.totalRows = 0;
          if (res.statusCode != "404") {
            this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
          }
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }


  trackByProperty<T>(_index: number, column: TableColumn<T>) {
    return column.property;
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

 
  // pagination code start here //
  pageChanged(event: any) {
    this.pageNumber = event.pageIndex + 1;
    this.getData();
  }


  createBidder() {
    const dialogRef = this.dialog.open(AddBidderComponent, {
      width: '400px',
      disableClose: true,
      data: '',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`); 
    });
  }
}
