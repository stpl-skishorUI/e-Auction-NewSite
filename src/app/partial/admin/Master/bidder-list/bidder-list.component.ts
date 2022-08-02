
import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject, Subscription } from 'rxjs';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { ConfirmationDialogComponent } from 'src/app/core/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { MasterService } from 'src/app/core/services/master.service';
import { AddBidderComponent } from './add-bidder/add-bidder.component';
import { BidderList } from './bidder-list.model';

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
  selection = new SelectionModel<BidderList>(true, []);
  searchCtrl = new UntypedFormControl();
  dataSource: MatTableDataSource<BidderList> | null | [];
  userRegistration: BidderList[];
  subject$: ReplaySubject<BidderList[]> = new ReplaySubject<BidderList[]>(1);
  subscription!: Subscription;

  @Input()
  pageNumber: number = 1;
  districtArray = [];
  bidderTypeArray = ['All', 'Individual', 'Organization'];
  columns: TableColumn<BidderList>[] = [
    { label: 'Sr.No', property: 'srNo', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Name', property: 'name', type: 'text', visible: true },
    { label: 'District', property: 'district', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Mobile', property: 'mobile', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Bidder Type', property: 'bidderType', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },

    { label: 'Dsc Status', property: 'isDsc', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Unblock Block', property: 'isBlock', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
  ];

  filterForm!: FormGroup;
  totalRows: number;

  constructor(public dialog: MatDialog,
    private apiService: ApiService, private fb: FormBuilder,
    public commonService: CommonService,
    private localstorageService: LocalstorageService,
    private masterService: MasterService,
    public configService: ConfigService,
    private error: ErrorsService) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize = 10;

  ngOnInit(): void {
    this.defultFilterform()
    this.getData();
    // this.createBidder();
  }

  defultFilterform() {
    this.filterForm = this.fb.group({
      districtId: [0],
      search: [''],
      bidderType: ['All'],
    });
    this.getDistrict();
  }
  createUser(): void {
    //@ts-ignore
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '250px',
      disableClose: false,
      data: '',
    });
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
          this.dataSource = null;
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

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  pageChanged(event: any) {
    this.pageNumber = event.pageIndex + 1;
    this.getData();
  }





  userBlockUnBlockModal(element: any, event: any, flag?: string) {
    let Title: string = 'Delete';
    let dialogText: string = 'Are you sure you want to delete this record ?';
    if (flag != 'isDelete') {
      event.checked == true ? Title = 'User Block' : Title = 'User Unblock';
      event.checked == true ? dialogText = 'Do you want to User Block' : dialogText = 'Do you want to User Unblock';
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '340px',
      data: { p1: dialogText, p2: '', cardTitle: Title, successBtnText: 'Yes', dialogIcon: 'done_outline', cancelBtnText: 'No' },
      disableClose: this.apiService.disableCloseFlag,
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (flag != 'isDelete') {
        res == 'Yes' ? this.userBlockUnBlock(element, event.checked) : !event.checked ? event.source.checked = true : event.source.checked = false;
      } else if (res == 'Yes') {
        this.deleteBidderUser(element?.bidderId)
      }

    });
  }

  // block user and unblock user 
  userBlockUnBlock(element: any, event: any) {
    let obj = {
      "id": element?.userId,
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

  // /delete functionality start here 
  deleteBidderUser(bidderId: number) {
    let obj = {
      "id": bidderId,
      'deletedBy': this.localstorageService.userId(),
    }
    this.apiService.setHttp('DELETE', "user-registration", false, JSON.stringify(obj), false, 'masterUrl');
    this.subscription = this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.getData();
          this.commonService.snackBar(res.statusMessage, 0);
        } else {
          // if (res.statusCode != "404") {
          this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
          // }
        }
      },
      error: (err: any) => { this.error.handelError(err) }
    })
  }

  createBidder(data?: any): void {
    const dialog = this.dialog.open(AddBidderComponent, {
      width: '1000px',
      data: data,
      // height: '100%',
      disableClose: this.apiService.disableCloseFlag,
    });

    dialog.afterClosed().subscribe(result => {
      if (result == true) {
        this.getData();
      }
    });
  }

  // filter code  start 

  getDistrict() {

    this.districtArray = [];
    this.subscription = this.masterService.getDistrictByDivisionId(0).subscribe({
      next: (response: any) => {
        let districtArray = response;
        districtArray.length > 1 ? this.districtArray.push({ id: 0, district: "All District" }, ...response) : this.districtArray = response;;
        this.filterForm.controls['districtId'].setValue(0)
        // districtArray.length == 1 ? (this.filterForm.controls['districtId'].setValue(this.districtArray[0].id), this.getTaluka(this.districtArray[0].id)) : '';
      },
      error: (err => { this.error.handelError(err) })
    })
  }

  filterData() {
    this.pageNumber = 1;
    this.getData();
  }


}
