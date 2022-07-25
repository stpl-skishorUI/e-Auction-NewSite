
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
import { ErrorsService } from 'src/app/core/services/errors.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
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
  dataSource: MatTableDataSource<BidderList> | null;
  userRegistration: BidderList[];
  subject$: ReplaySubject<BidderList[]> = new ReplaySubject<BidderList[]>(1);
  subscription!: Subscription;

  @Input()
  pageNumber: number = 1;
  columns: TableColumn<BidderList>[] = [
    { label: 'Sr.No', property: 'srNo', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Name', property: 'name', type: 'text', visible: true },
    { label: 'District', property: 'district', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Mobile', property: 'mobile', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Bidder Type', property: 'bidderType', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },

    { label: 'Dsc Status', property: 'isDsc', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Unblock Block', property: 'isBlock', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
  ];

  filterForm!: FormGroup;
  totalRows: number;

  constructor(public dialog: MatDialog,
    private apiService: ApiService, private fb: FormBuilder,
    public commonService: CommonService,
    private localstorageService: LocalstorageService,
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



  createBidder() {
    const dialogRef = this.dialog.open(AddBidderComponent, {
      width: '60rem',
      disableClose: true,
      data: '',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  userBlockUnBlockModal(element: any, event: any) {
    let Title: string, dialogText: string;
    event.checked == true ? Title = 'User Block' : Title = 'User Unblock';
    event.checked == true ? dialogText = 'Do you want to User Block' : dialogText = 'Do you want to User Unblock';
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '340px',
      data: { p1: dialogText, p2: '', cardTitle: Title, successBtnText: 'Yes', dialogIcon: 'done_outline', cancelBtnText: 'No' },
      disableClose: this.apiService.disableCloseFlag,
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      res == 'Yes' ? this.userBlockUnBlock(element, event.checked) : !event.checked ? event.source.checked = true : event.source.checked = false;
    });
  }

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
}
