
import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { StaticDropdownService } from 'src/app/core/services/static-dropdown.service';
import { EventList } from './event-list.model';


@Component({
  selector: 'vex-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class EventListComponent implements OnInit {
  layoutCtrl = new UntypedFormControl('boxed');
  dataSource: MatTableDataSource<EventList> | null;
  selection = new SelectionModel<EventList>(true, []);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  filterForm!: FormGroup;
  pageNumber: number = 1;
  totalRows: any;
  apprRejStatusArray = this.staticDropdownService.approvedStatus();
  selectLevelArray = this.staticDropdownService.getSelectLevel(true);
  oneMonthBeforeDate = this.commonService.subtractOneMontFromToDate();
  localstorageData = this.localstorageService.getLoggedInLocalstorageData().responseData;
  maxDate: any = new Date();
  initalValues: any;
  checkFormValueChange!: boolean;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];

  columns: TableColumn<EventList>[] = [
    { label: 'Sr.No', property: 'srNo', type: 'text', visible: true },
    { label: 'Event ID', property: 'eventCode', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Event Title', property: 'title', type: 'text', visible: true },
    { label: 'Event Level', property: 'eventLevel', type: 'text', visible: true },
    { label: 'Total Items',  property: 'totalItem', type: 'text', visible: true },
    { label: 'Event Start Date', property: 'startDateTime', type: 'text', visible: true },
    { label: 'Event End Date', property: 'endDateTime', type: 'text', visible: true },
    { label: 'Event Creation Date', property: 'createdDate', type: 'text', visible: true },
    { label: 'Approve Status', property: 'status', type: 'text', visible: true },
    { label: 'Action', property: 'edit', type: 'button', visible: true },
  ];

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  constructor(
    private fb: FormBuilder,
    private error: ErrorsService,
    private apiService: ApiService,
    public commonService: CommonService,
    public dialog: MatDialog,
    public staticDropdownService: StaticDropdownService,
    private datePipe: DatePipe,
    private localstorageService: LocalstorageService,
  ) { }

  ngOnInit() {
    this.defultFilterform();
    this.getAllEventList();  
  }

  defultFilterform() {
    this.filterForm = this.fb.group({
      eventLevel: [''],
      status: [''],
      fromDate: [this.oneMonthBeforeDate],
      toDate: [new Date()],
      searchtext: [''],
    });
    this.initalValues = this.filterForm.value;
  }

  filterData() {
    this.pageNumber = 1;
    this.getAllEventList();
  }

  getAllEventList() {
    let formValue = this.filterForm.value;
    formValue.fromDate = this.datePipe.transform(formValue.fromDate, 'YYYY/MM/dd');
    formValue.toDate = this.datePipe.transform(formValue.toDate, 'YYYY/MM/dd');
    let obj = "EventLevel=" + formValue.eventLevel + "&DistrictId=" + this.localstorageData?.districtId + "&MineralId=" + 0 + "&TenderType=" + '' +
      "&pageno=" + this.pageNumber + "&pagesize=" + 10 + "&TextSearch=" + formValue.searchtext + "&Status=" + formValue.status + "&StartDate=" + formValue.fromDate + "&EndDate=" + formValue.toDate;
    this.apiService.setHttp('get', "event-creation/getAll?" + obj + '&IsPublished=2', false, false, false, 'bidderUrl', true);
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.dataSource = new MatTableDataSource(res.responseData.responseData1);
          this.dataSource.sort = this.sort;
          this.totalRows = res.responseData.responseData2;
          this.totalRows = this.totalRows[0].pageCount;
          this.pageNumber == 1 ? this.paginator?.firstPage() : '';
        } else {
          this.dataSource = null;
          this.totalRows = 0;
          if (res.statusCode != "404") {
            this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
          }
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }

  pageChanged(event: any) {
    this.pageNumber = event.pageIndex + 1;
    this.getAllEventList();
  }

  navigatePage(flag: any, eventCode: any, eventId?: any, totalItem?: any) {
    if (flag == 1) {
      this.commonService.routerLinkRedirect('../e-detail/' + eventId);
    } else {
      this.commonService.routerLinkRedirect('/lots-upload/' + eventCode + '/' + eventId + '/' + totalItem);
    }
  }

  // addEventDailog(data?: object) {
  //   const dialogRef = this.dialog.open(AuctionScreenComponent, {
  //     width: this.apiService.modalSize[2], // p1 for paragraph 1 same as paragraph 2.
  //     data: data,
  //     disableClose: this.apiService.disableCloseFlag,
  //   });
  //   dialogRef.afterClosed().subscribe((result: any) => {
  //     if (result == 'Yes') {
  //       this.getAllEventList();
  //     }
  //   })
  // }


}
