import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UntypedFormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { StaticDropdownService } from 'src/app/core/services/static-dropdown.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidatorService } from 'src/app/core/services/validator.service';
import { Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
//import { DetailsComponent } from 'src/app/partial/dialogs/details/details.component';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';

import { DialogService } from 'src/app/core/services/dialog.service';
import { EventDetail, LotCreation } from './interfaces/event-detail.model';
import { AuctionPlotProfileComponent } from 'src/app/partial/bidder/auction-plot-profile/auction-plot-profile.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'vex-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})

export class HomeComponent implements OnInit {
  columns: TableColumn<EventDetail>[] = [
    { label: 'srNo', property: 'srNo', type: 'button', visible: true },
    { label: 'Event Level', property: 'eventLevel', type: 'text', visible: true },
    { label: 'District/ SDO/ Tehsil', property: 'district', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Event Id', property: 'eventCode', type: 'text', visible: false, cssClasses:['text-secondary', 'font-medium'] },
    { label: 'Title', property: 'title', type: 'text', visible: true, cssClasses:['text-secondary', 'font-medium']  },
    { label: 'Bid Submission End Date & Time', property: 'bidSubmissionEndDate', type: 'button', visible: false, cssClasses: ['text-secondary', 'font-medium']  },
    { label: 'Bid Opening Date & Time', property: 'startDateTime', type: 'button', visible: false, cssClasses: ['text-secondary', 'font-medium']  },
    { label: 'Item Count', property: 'totalItem', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium']  },
    { label: 'Actions', property: 'actions', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium']  },
  ];

  eventDetailsColumns:TableColumn<LotCreation>[]=[
    { label: 'srNo', property: 'srNo', type: 'button', visible: true },
    { label: 'Item Number And Name', property: 'itemName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Mineral', property: 'material', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Taluka / CTSO	', property: 'taluka', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Village', property: 'village', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Area', property: 'area', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Allowed Quantity (InBrass)	', property: 'quantity', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Tender / Application Fee', property: 'tender_ApplicationFee', type: 'currency', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Offset Value	', property: 'offsetValue', type: 'currency', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'EMD', property: 'emD_SecurityDeposit', type: 'currency', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'View Item Details', property: 'action', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
  ];

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  get visibleColumnsEvent() {
    return this.eventDetailsColumns.filter(column => column.visible).map(column => column.property);
  }
  
  eventDetails: MatTableDataSource<LotCreation>;
  checkUserLogFlag: boolean = false;
  participatedBidderEventlist: any[] = [];
  expandedElement!: any | null;
  pageNumber: number = 1;
  layoutCtrl = new UntypedFormControl('boxed');
  totalRows: number = 0;
  tabChangeFlag: string = 'Active';  
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<EventDetail> | null;
  selection = new SelectionModel<any>(true, []);
  searchCtrl = new UntypedFormControl();
  filterForm!: FormGroup ;
  activeTab: string = 'Active';
  tableDataArray =[];
  lavelArray = [];
  dropDownSelFlag: boolean = true;
  districtArray = [];
  MineralArray = [];
  tabCountFlag!: string;
  tenderCountData: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  tabs: any = [{ count: '' }, { count: '' }]
  constructor(private commonService: CommonService, private masterService: MasterService, public VB: ValidatorService,
    public localstorageService: LocalstorageService, private error: ErrorsService, private staticDropdownService: StaticDropdownService, public router: Router,
    private apiService: ApiService, private fb: FormBuilder, public configService: ConfigService, private dialogService: DialogService, private datePipe: DatePipe,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    this.defulatForm();
    this.levelArray();
    this.getMineral();
  }
  // new code start here
  trackByProperty<T>(_index: number, column: TableColumn<T>) {
    return column.property;
  }

  eventDetailsdialog(data:EventDetail) {
    console.log(data);
    let arrayObj = [
      { 'key': 'Title', 'val': data.title, row: 1, col: 1, type: 'text' },
      { 'key': 'Description', 'val': data.description, row: 1, col: 2, type: 'text' },
      { 'key': 'Level', 'val': data.eventLevel, row: 1, col: 2, type: 'text' },
      { 'key': 'Bid Submission End Date & Time', 'val': this.datePipe.transform(data.bidSubmissionEndDate, 'dd/MM/yyyy') == '01/01/0001' ? '-' : this.datePipe.transform(data.bidSubmissionEndDate, 'dd/MM/yyyy'), col: 2, type: 'date' },
      { 'key': 'Bid Opening Date & Time / Bid Starting Date & Time', 'val': this.datePipe.transform(data.bidSubmissionStartDate, 'dd/MM/yyyy') == '01/01/0001' ? '-' : this.datePipe.transform(data.bidSubmissionStartDate, 'dd/MM/yyyy'), col: 2, type: 'date' },
     
    ]
    this.dialogService.detailsComponentDialog(arrayObj, 'Event Details', this.apiService.modalSize[2]); // call details dialog modal
  }



  //--------------------------------------------------------filter dropdown start heare -----------------------------------------------------//

  levelArray() {
    this.lavelArray = this.staticDropdownService.getSelectLevel(true);
    this.lavelArray.length == 1 || this.dropDownSelFlag ? (this.filterForm.controls['levelId'].setValue(this.lavelArray[0].val), this.getDistrict()) : '';
  }

  getDistrict() {
    this.masterService.getDistrict(0).subscribe({
      next: (response: any) => {
        this.districtArray.push({ district: "All District", id: 0, divisionId: 0, division: 'All' }, ...response);
        this.districtArray.length == 1 || this.dropDownSelFlag ? (this.filterForm.controls['districtId'].setValue(this.districtArray[0].id), this.getMineral()) : '';
      },
      error: (err => { this.error.handelError(err) })
    })
  }

  getMineral() {
    this.masterService.getMaterial().subscribe({
      next: (response: any) => {
        this.MineralArray.push({ materialId: 0, material: "All Mineral" }, ...response);
        this.MineralArray.length == 1 || this.dropDownSelFlag ? (this.filterForm.controls['mineralId'].setValue(this.MineralArray[0].materialId), this.bindTable()) : '';
      },
      error: (err => { this.error.handelError(err) })
    })
  }

  //--------------------------------------------------------filter dropdown end heare -----------------------------------------------------//

  defulatForm() {
    this.filterForm = this.fb.group({
      levelId: [''],
      districtId: [0],
      mineralId: [0],
      search: [''],
      startDate: [''],
      endDate: [''],
    })
  }

  getTenderCount(Obj: Object) {
    Obj += '&TenderType=' + this.tabCountFlag
    this.apiService.setHttp('get', 'event-creation/getTenderCount' + Obj, false, false, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.tenderCountData = res.responseData;
          if (this.commonService.checkDataType(this.tabCountFlag) == false) {
            this.tabs[0]['count'] = this.tenderCountData.active;
            this.tabs[1]['count'] = this.tenderCountData.upcoming;
          } else {
            this.tabCountFlag == 'Active' ? this.tabs[0]['count'] = this.tenderCountData.active : this.tabCountFlag == 'Upcoming' ? this.tabs[1]['count'] = this.tenderCountData.upcoming : '';
          }
        } else {
          if (res.statusCode != "404") {
            this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
          }
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }

  bindTable() {
    const formValue = this.filterForm.value;
    let paramList = '?EventLevel=' + formValue.levelId + '&DistrictId=' + formValue.districtId + '&MineralId=' + formValue.mineralId + '&pageno=' + this.pageNumber + '&pagesize=' + this.configService.pageSize //+'&Status=&StartDate=1&EndDate=1'
    if (formValue.startDate && formValue.endDate) {
      const startDate = this.datePipe.transform(formValue.startDate, 'yyyy-MM-dd');
      const enddate = this.datePipe.transform(formValue.endDate, 'yyyy-MM-dd');
      paramList += '&StartDate=' + startDate + '&EndDate=' + enddate
    }
    this.commonService.checkDataType(formValue.search) == true ? paramList += "&TextSearch=" + formValue.search : "";
    paramList += '&TenderType=' + this.tabChangeFlag;
    this.apiService.setHttp('get', 'event-creation/getAll' + paramList + "&IsPublished=1", false, false, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res['statusCode'] === "200") {
          this.tableDataArray = res['responseData'].responseData1;
          this.dataSource = new MatTableDataSource(this.tableDataArray);
          this.dataSource.sort = this.sort;
          this.totalRows = res.responseData.responseData2[0].pageCount;
          this.totalRows > 10 && this.pageNumber == 1 ? this.paginator?.firstPage() : '';
          this.getTenderCount(paramList);
        } else {
          this.dataSource = null;
          if (res['statusCode'] != "404") {
            this.commonService.checkDataType(res['statusMessage']) == false ? this.error.handelError(res['statusCode']) : this.commonService.snackBar(res['statusMessage'], 1);
          }
        }
      },
      error: ((error) => { this.error.handelError(error.status) })
    });
  }

  onChangeTab(event: MatTabChangeEvent) {
    event?.index == 0 ? this.tabChangeFlag = 'Active' : event?.index == 1 ? this.tabChangeFlag = 'Upcoming' : this.tabChangeFlag = '';
    this.tabCountFlag = this.tabChangeFlag;
    this.bindTable();
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  calculateDiff(date: Date) {
    var date1 = new Date(date);
    let date2 = new Date();
    var Difference_In_Time = date1.getTime() - date2.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    Difference_In_Days++;
    return parseInt(Difference_In_Days.toString());
  }

  openEventDetailsDialog(data: EventDetail) {
    let arrayObj = [

      { 'key': 'Title', 'val': data.title, row: 1, tag: '<p> </p>', class: "", col: 1 },
      { 'key': 'Description', 'val': data.description, row: 1, tag: '<p> </p>', class: "", col: 1 },
      { 'key': 'Level', 'val': data.eventLevel, row: 1, tag: '<p> </p>', class: "", col: 1 },
      { 'key': 'Bid Submission End Date & Time', 'val': this.datePipe.transform(data.bidSubmissionEndDate, 'dd/MM/yyyy & h:m:a'), row: 1, tag: '<p> </p>', class: "", col: 1 },
      { 'key': 'Bid Opening Date & Time / Bid Starting Date & Time', 'val': this.datePipe.transform(data.startDateTime, 'dd/MM/yyyy & h:m:a'), row: 1, tag: '<p> </p>', class: "", col: 1 },
    ]

    this.dialogService.detailsComponentDialog(arrayObj, 'Event Details', this.apiService.modalSize[2]); // call details dialog modal
  }

  expandEventrDetails(eventId: number, totalItems: number) {
    if (totalItems <= 0) {
      this.commonService.snackBar('Event item count is zero', 1);
      return
    }
    this.apiService.setHttp('get', "lot-creation/getByEventId/" + eventId, false, false, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: object) => {
        if (res['statusCode'] === "200") {
          let tempEventDetailArray = res['responseData'];
          tempEventDetailArray.map((res: object) => {
            res['eventParticipateId'] != 0 && this.tabChangeFlag == "Active" ? (res['isparticipateflag'] = true) : res['isparticipateflag'] = false; //,this.isparticipateEvent(false,res,true)
          })
          if (this.participatedBidderEventlist.length && this.commonService.someOfArrayObject(this.participatedBidderEventlist, 'eventId', eventId)) {
            let eventIdIndex = this.commonService.findIndexOfArrayObject(this.participatedBidderEventlist, 'eventId', eventId);
            tempEventDetailArray.map((ele: object) => {
              for (let j = 0; j <= this.participatedBidderEventlist.length; j++) {
                if (this.participatedBidderEventlist[eventIdIndex]?.participatedBidderEventslst[j]?.eventLotId == ele['id'] || ele['eventParticipateId'] != 0) {
                  ele['isparticipateflag'] = true;
                }
              }
            })
          }
          this.eventDetails = new MatTableDataSource(tempEventDetailArray);
          // this.spinner.hide();
        } else {
          // this.spinner.hide();
          // this.eventDetails = []
          if (res['statusCode'] != "404") {
            this.commonService.checkDataType(res['statusMessage']) == false ? this.error.handelError(res['statusCode']) : this.commonService.snackBar(res['statusMessage'], 1);
          }
        }
      },
      error: ((error) => { this.error.handelError(error.status) })
    });
  }

 

  isparticipateEvent(event: MatCheckboxChange | any, element: object, isparticipateEvent?: boolean) {
    let checkboxFlag;
    isparticipateEvent == true ? checkboxFlag = true : checkboxFlag = event.source.checked;
    let obj: Object;
    obj = {
      createdBy: this.checkUserLogFlag == true ? this.localstorageService.userId() : 0,
      modifiedBy: this.checkUserLogFlag == true ? this.localstorageService.userId() : 0,
      createdDate: new Date(),
      modifiedDate: new Date(),
      isDeleted: false,
      id: 0,
      eventParticipateId: 0,
      bidderId: this.checkUserLogFlag == true ? this.localstorageService.getBidderId() : 0,
      eventId: element['eventId'],
      eventLotId: element['id'],
      isTender_ApplicationFeePaid: false,
      isEMD_SecurityDepositPaid: false,
      biddingId: ""
    }
    let tempobj = {
      createdBy: this.checkUserLogFlag == true ? this.localstorageService.userId() : 0,
      modifiedBy: this.checkUserLogFlag == true ? this.localstorageService.userId() : 0,
      createdDate: new Date(),
      modifiedDate: new Date(),
      isDeleted: false,
      id: 0,
      bidderId: this.checkUserLogFlag == true ? this.localstorageService.getBidderId() : 0,
      eventId: element['eventId'],
      isDocumentSubmitted: false,
      isDocumentApproved: false,
      participatedBidderEventslst: [obj],
      eventLotId: element['id'],
    }
    if (checkboxFlag) {
      let eventIdIndex = this.commonService.findIndexOfArrayObject(this.participatedBidderEventlist, 'eventId', element['eventId']);
      if (eventIdIndex >= 0) {
        this.participatedBidderEventlist[eventIdIndex].participatedBidderEventslst.push(obj);
      } else {
        this.participatedBidderEventlist.push(tempobj);
      }
    } else {
      let eventIdIndex = this.commonService.findIndexOfArrayObject(this.participatedBidderEventlist, 'eventId', element['eventId']);
      let eventLotIdIdIndex = this.commonService.findIndexOfArrayObject(this.participatedBidderEventlist[eventIdIndex].participatedBidderEventslst, 'eventLotId', element['id']);
      this.participatedBidderEventlist[eventIdIndex].participatedBidderEventslst.splice(eventLotIdIdIndex, 1);
      this.participatedBidderEventlist[eventIdIndex].participatedBidderEventslst.length == 0 ? this.participatedBidderEventlist.splice(eventIdIndex, 1) : '';
    }
  }


  // ...................... participate button  function  start..................................../
  onclickParticipateBtn() {
    for (var i = 0; i < this.participatedBidderEventlist.length; i++) {
      delete this.participatedBidderEventlist[i]['eventLotId'];
    }
    this.apiService.setHttp('post', "event-participate", false, JSON.stringify(this.participatedBidderEventlist), false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.router.navigate(['event-details']);

        } else {
          this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }

  pageChanged(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.bindTable();
  }
  

  plotProfile(_id:any){
    this.dialog.open(AuctionPlotProfileComponent).afterClosed().subscribe((res) => {
      /**
       * Customer is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (res) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */ 
      }
    });
  }
}
