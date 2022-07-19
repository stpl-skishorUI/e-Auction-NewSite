import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { TranslateService } from 'src/app/core/services/translate.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { filter, Observable, of, ReplaySubject } from 'rxjs';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { untilDestroyed } from '@ngneat/until-destroy';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { trigger, state, style, transition, animate } from '@angular/animations';

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
  eventDetails: any;
  checkUserLogFlag: boolean = false;
  participatedBidderEventlist: any[] = [];
  expandedElement!: any | null;
  pageNo: number = 1;
  layoutCtrl = new UntypedFormControl('boxed');
  activecolumnsToDisplay = ['srNo', 'eventLevel', 'district', 'eventCode', 'title', 'bidSubmissionEndDate', 'startDateTime', 'totalItem', 'download'];
  tabChangeFlag: string = 'Active';
  eventColumns = ['srNo', 'itemName', 'material', 'taluka', 'village', 'area', 'quantity', 'tender_ApplicationFee', 'offsetValue', 'emD_SecurityDeposit', 'ViewItem']
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<any> | null;
  selection = new SelectionModel<any>(true, []);
  searchCtrl = new UntypedFormControl();
  topFilterForm: FormGroup | any;
  activeTab: string = 'Active';
  tableDataArray:any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private dialog: MatDialog, private commonService: CommonService, private datePipe: DatePipe,
    public localstorageService: LocalstorageService,
    private error: ErrorsService, private apiService: ApiService, private fb: FormBuilder, private configService: ConfigService) {
  }
  /**
   * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
   * We are simulating this request here.
   */


  ngOnInit() {
    this.defulatForm();
    this.bindTable();
  }

  defulatForm() {
    this.topFilterForm = this.fb.group({
      levelId: [''],
      districtId: [0],
      mineralId: [0],
      search: [''],
      startDate: [''],
      endDate: [''],
    })
  }

  bindTable() {
    const formValue = this.topFilterForm.value;
    let paramList = '?EventLevel=' + formValue.levelId + '&DistrictId=' + formValue.districtId + '&MineralId=' + formValue.mineralId + '&pageno=' + this.pageNo + '&pagesize=' + this.configService.pageSize //+'&Status=&StartDate=1&EndDate=1'
    if (formValue.startDate && formValue.endDate) {
      const startDate = this.datePipe.transform(formValue.startDate, 'yyyy-MM-dd');
      const enddate = this.datePipe.transform(formValue.endDate, 'yyyy-MM-dd');
      paramList += '&StartDate=' + startDate + '&EndDate=' + enddate
    }
    this.commonService.checkDataType(formValue.search) == true ? paramList += "&TextSearch=" + formValue.search : "";
    paramList += '&TenderType=Active';
    this.apiService.setHttp('get', 'event-creation/getAll' + paramList + "&IsPublished=1", false, false, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
            this.tableDataArray = res.responseData.responseData1;
           this.dataSource = new MatTableDataSource(this.tableDataArray);
        } else {
          if (res.statusCode != "404") {
            this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
          }
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
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

  calculateDiff(date: any) {
    var date1 = new Date(date);
    let date2 = new Date();
    var Difference_In_Time = date1.getTime() - date2.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    Difference_In_Days++;
    return parseInt(Difference_In_Days.toString());
  }

  openEventDetailsDialog(data: object) {

  }

  expandEventrDetails(eventId: number, totalItems: any) {
    if (totalItems <= 0) {
      this.commonService.snackBar('Event item count is zero', 1);
      return
    }
    this.apiService.setHttp('get', "lot-creation/getByEventId/" + eventId, false, false, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          let tempEventDetailArray = res.responseData;
          tempEventDetailArray.map((res: any) => {
            res.eventParticipateId != 0 && this.tabChangeFlag == "Active" ? (res.isparticipateflag = true) : res.isparticipateflag = false; //,this.isparticipateEvent(false,res,true)
          })
          if (this.participatedBidderEventlist.length && this.commonService.someOfArrayObject(this.participatedBidderEventlist, 'eventId', eventId)) {
            let eventIdIndex = this.commonService.findIndexOfArrayObject(this.participatedBidderEventlist, 'eventId', eventId);
            tempEventDetailArray.map((ele: any) => {
              for (let j = 0; j <= this.participatedBidderEventlist.length; j++) {
                if (this.participatedBidderEventlist[eventIdIndex]?.participatedBidderEventslst[j]?.eventLotId == ele.id || ele.eventParticipateId != 0) {
                  ele.isparticipateflag = true;
                }
              }
            })
          }

          this.eventDetails = new MatTableDataSource(tempEventDetailArray);
          // this.spinner.hide();
        } else {
          // this.spinner.hide();
          // this.eventDetails = []
          if (res.statusCode != "404") {
            this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
          }
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }

  plotProfile(id: any) {

  }

  isparticipateEvent(event: MatCheckboxChange | any, element: any, isparticipateEvent?: boolean) {
    let checkboxFlag;
    isparticipateEvent == true ? checkboxFlag = true : checkboxFlag = event.source.checked;

    let obj: any;
    obj = {
      createdBy: this.checkUserLogFlag == true ? this.localstorageService.userId() : 0,
      modifiedBy: this.checkUserLogFlag == true ? this.localstorageService.userId() : 0,
      createdDate: new Date(),
      modifiedDate: new Date(),
      isDeleted: false,
      id: 0,
      eventParticipateId: 0,
      bidderId: this.checkUserLogFlag == true ? this.localstorageService.getBidderId() : 0,
      eventId: element.eventId,
      eventLotId: element.id,
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
      eventId: element.eventId,
      isDocumentSubmitted: false,
      isDocumentApproved: false,
      participatedBidderEventslst: [obj],
      eventLotId: element.id,
    }
    if (checkboxFlag) {
      let eventIdIndex = this.commonService.findIndexOfArrayObject(this.participatedBidderEventlist, 'eventId', element.eventId);
      if (eventIdIndex >= 0) {
        this.participatedBidderEventlist[eventIdIndex].participatedBidderEventslst.push(obj);
      } else {
        this.participatedBidderEventlist.push(tempobj);
      }

    } else {
      let eventIdIndex = this.commonService.findIndexOfArrayObject(this.participatedBidderEventlist, 'eventId', element.eventId);
      let eventLotIdIdIndex = this.commonService.findIndexOfArrayObject(this.participatedBidderEventlist[eventIdIndex].participatedBidderEventslst, 'eventLotId', element.id);
      this.participatedBidderEventlist[eventIdIndex].participatedBidderEventslst.splice(eventLotIdIdIndex, 1);
      this.participatedBidderEventlist[eventIdIndex].participatedBidderEventslst.length == 0 ? this.participatedBidderEventlist.splice(eventIdIndex, 1) : '';
    }
  }
}
