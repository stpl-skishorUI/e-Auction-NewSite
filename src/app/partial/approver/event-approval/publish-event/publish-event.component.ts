import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { StaticDropdownService } from 'src/app/core/services/static-dropdown.service';
import { ValidatorService } from 'src/app/core/services/validator.service';
import { PublishEvent } from './publish-event.model';

@Component({
  selector: 'vex-publish-event',
  templateUrl: './publish-event.component.html',
  styleUrls: ['./publish-event.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class PublishEventComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<PublishEvent> | null;
  locFilterData:object | any;
  pageNumber: number = 1;
  filterForm!: FormGroup;
  initalValues: object;
  totalRows: number;
  isPublishFlag: number = 0;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize = 10;

  columns: TableColumn<PublishEvent>[] = [
    { label: 'Sr.No', property: 'srNo', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Event ID', property: 'eventCode', type: 'button', visible: true, cssClasses: ['font-medium'] },
    { label: 'Event Title', property: 'title', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Event Fee', property: 'eventFee', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Event Level', property: 'eventLevel', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Total Items', property: 'totalItems', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Event Created By', property: 'createdByName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Event Creation Date', property: 'createdDate', type: 'date', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
  ];

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private apiService: ApiService,
    private error: ErrorsService,
    private localstorageService: LocalstorageService,
    private datePipe: DatePipe,
    public validatorService: ValidatorService,
    public StaticDropdownService: StaticDropdownService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    let checkFilterValue = localStorage.getItem('filter');
    if (checkFilterValue) {
      let prevUrlFlag = this.commonService.prevUrl('online-item-details');
      if (prevUrlFlag == true) {
        this.locFilterData = JSON.parse(checkFilterValue);
        this.locFilterData?.pageNumber != 1 ? this.pageNumber = this.locFilterData?.pageNumber : '';
      } else {
        this.commonService.removeFilerLocalStorage('filter');
      }
    }
    this.defaultForm();
    this.bindTable();
  }

  onChangeTab(event: MatTabChangeEvent) {
    this.isPublishFlag = event['index'];
    if (this.isPublishFlag == 1) {
      this.columns.push(
        { label: 'Bid Submission Start Date', property: 'bidSubmissionStartDate', type: 'date', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
        { label: 'Bid Submission End Date', property: 'bidSubmissionEndDate', type: 'date', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
        { label: 'Status', property: 'status', type: 'badge', visible: true, cssClasses: ['text-secondary', 'font-medium'] }
      )
    } else {
      const filteredColumns = this.columns.filter((ele) => (ele['property'] != 'bidSubmissionStartDate' && ele['property'] != 'bidSubmissionEndDate' && ele['property'] != 'status'));
      this.columns = filteredColumns;
    }
    this.pageNumber = 1;
    this.clearFilter();
    this.bindTable();
  }

  // -------------------------- Filter Form -------------------------------//
  defaultForm() {
    this.filterForm = this.fb.group({
      eventLevel: [this.locFilterData?.eventLevel || ''],
      formDate: [this.locFilterData?.formDate || ''],
      endDate: [this.locFilterData?.endDate || ''],
      searchText: [this.locFilterData?.searchText || '']
    });
    this.initalValues = this.filterForm.value;
  }
  // -------------------------- Filter Form End-------------------------------//

  bindTable() {
    let formValue = this.filterForm.value;
    const districtId = this.localstorageService.getLoggedInLocalstorageData()?.responseData;
    let paramList: string = "?DistrictId=" + districtId?.districtId + "&IsPublished=" + this.isPublishFlag + "&pageno=" + this.pageNumber + "&pagesize=" + this.pageSize;
    if (formValue?.eventLevel) paramList += "&EventLevel=" + formValue.eventLevel.trim();
    if (formValue?.formDate) paramList += "&StartDate=" + this.datePipe.transform(formValue.formDate, 'yyyy-MM-dd');;
    if (formValue?.endDate) paramList += "&EndDate=" + this.datePipe.transform(formValue.endDate, 'yyyy-MM-dd');
    if (formValue?.searchText) paramList += "&Textsearch=" + formValue.searchText.trim();

    this.apiService.setHttp('get', "event-creation/getByCriteria" + paramList + "&IsSendforApproval=1", false, false, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: object) => {
        if (res['statusCode'] === "200") {
          this.dataSource = new MatTableDataSource(res['responseData'].responseData1);
          this.totalRows = res['responseData'].responseData2[0].pageCount;
          (this.totalRows > 10 && this.pageNumber == 1) ? this.paginator?.firstPage() : '';
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource = null;
          this.totalRows = 0;
          if (res['statusCode'] != "404") {
            this.commonService.checkDataType(res['statusMessage']) == false ? this.error.handelError(res['statusCode']) : this.commonService.snackBar(res['statusMessage'], 1);
          }
        }
      },
      error: ((error: object) => { this.error.handelError(error['status']) })
    });
  }

  // --------------------- pagination  -------------------------------//
  pageChanged(event: PageEvent) {
    if(event.pageSize !=10) this.pageSize = event.pageSize;
    this.commonService.removeFilerLocalStorage('pagination');
    this.pageNumber = event.pageIndex + 1;
    this.bindTable();
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  getData() {
    this.pageNumber = 1;
    this.bindTable();
  }

  clearFilter() {
    this.defaultForm();
  }

  redirectToOnItemDetails(id:any,redLink:any) {
    let eq = this.commonService.checkFormValueChange(this.initalValues, this.filterForm.value);
    eq == false ? (this.filterForm.value['pageNumber'] = this.pageNumber, localStorage.setItem('filter', JSON.stringify(this.filterForm.value))) : '';
    this.router.navigate([redLink+id], {relativeTo:this.route});
    
  }

}
