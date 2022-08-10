
import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { StaticDropdownService } from 'src/app/core/services/static-dropdown.service';
import { EventCreationComponent } from '../event-creation/event-creation.component';
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
  dataSource: MatTableDataSource<EventList> | [];
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
  noDataFlag:boolean = false;

  columns: TableColumn<EventList>[] = [
    { label: 'srNo', property: 'srNo', type: 'button', visible: true },
    { label: 'Event Code', property: 'eventCode', type: 'button', visible: true, cssClasses: ['font-medium'] },
    { label: 'Title', property: 'title', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Event Level', property: 'eventLevel', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Total Item', property: 'totalItem', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Start Date Time', property: 'startDateTime', type: 'button', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'End Date Time', property: 'endDateTime', type: 'button', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Created Date', property: 'createdDate', type: 'button', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Approve Status', property: 'status', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
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
    private dialogService: DialogService,
    private spinner: NgxSpinnerService,
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
    this.spinner.show();
    let formValue = this.filterForm.value;
    formValue.fromDate = this.datePipe.transform(formValue.fromDate, 'YYYY/MM/dd');
    formValue.toDate = this.datePipe.transform(formValue.toDate, 'YYYY/MM/dd');
    let obj = "EventLevel=" + formValue.eventLevel + "&DistrictId=" + this.localstorageData?.districtId + "&MineralId=" + 0 + "&TenderType=" + '' +
      "&pageno=" + this.pageNumber + "&pagesize=" + this.pageSize + "&TextSearch=" + formValue.searchtext + "&Status=" + formValue.status + "&StartDate=" + formValue.fromDate + "&EndDate=" + formValue.toDate;
    this.apiService.setHttp('get', "event-creation/getAll?" + obj + '&IsPublished=2', false, false, false, 'bidderUrl', true);
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode === "200") {
          this.dataSource = new MatTableDataSource(res['responseData'].responseData1);
          this.dataSource.sort = this.sort;
          this.noDataFlag= true;  
          this.totalRows = res.responseData.responseData2[0].pageCount;
          this.pageNumber == 1 ? this.paginator?.firstPage() : '';
        } else {
          this.spinner.hide();
          this.dataSource = [];
          this.totalRows = 0;
          if (res.statusCode != "404") {
            this.spinner.hide();
            this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
          }
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }

  pageChanged(event: any) {
    // if(event.pageSize !=10) this.pageSize = event.pageSize;
    this.pageSize = event.pageSize;
    this.commonService.removeFilerLocalStorage('pagination');
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


  eventDetails(data) {
    let arrayObj = [
      { 'key': 'Event ID', 'val': data.eventCode, row: 1, col: 1, type: 'text' },
      { 'key': 'Event Title', 'val': data.title, row: 1, col: 2, type: 'text' },
      { 'key': 'Event Level', 'val': data.eventLevel, row: 1, col: 2, type: 'text' },
      { 'key': 'Total Items', 'val': data.totalItem, row: 1, col: 1, type: 'text' },
      { 'key': 'Start Date Time', 'val': this.datePipe.transform(data.startDateTime, 'dd/MM/yyyy') == '01/01/0001' ? '-' : this.datePipe.transform(data.startDateTime, 'dd/MM/yyyy'), col: 2, type: 'date' },
      { 'key': 'End Date Time', 'val': this.datePipe.transform(data.endDateTime, 'dd/MM/yyyy') == '01/01/0001' ? '-' : this.datePipe.transform(data.endDateTime, 'dd/MM/yyyy'), col: 2, type: 'date' },
      { 'key': 'Created Date', 'val': this.datePipe.transform(data.createdDate, 'dd/MM/yyyy'), col: 2, type: 'date' },
      { 'key': 'Approve Status', 'val': data.status, row: 1, col: 1, type: 'badge' },
    ]
    this.dialogService.detailsComponentDialog(arrayObj, 'Event Details', this.apiService.modalSize[2]); // call details dialog modal
  }


  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }


  createEvent(data?:object) {
    const dialogRef = this.dialog.open(EventCreationComponent, {
      width: this.apiService.modalSize[2], // p1 for paragraph 1 same as paragraph 2.
      data: data,
      disableClose: this.apiService.disableCloseFlag,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Yes') {
        this.getAllEventList();
      }
    })
  }

}
