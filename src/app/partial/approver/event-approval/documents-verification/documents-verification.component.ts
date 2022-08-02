import { SelectionModel } from '@angular/cdk/collections';
// import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
// import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
 import { ReplaySubject } from 'rxjs';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';
import { StaticDropdownService } from 'src/app/core/services/static-dropdown.service';
import { ValidatorService } from 'src/app/core/services/validator.service';
// import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { DocumentsVerification } from './documents-verification.model';

@Component({
  selector: 'vex-documents-verification',
  templateUrl: './documents-verification.component.html',
  styleUrls: ['./documents-verification.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class DocumentsVerificationComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  layoutCtrl = new UntypedFormControl('boxed');
  dataSource: MatTableDataSource<DocumentsVerification> | null;
  selection = new SelectionModel<DocumentsVerification>(true, []);
  searchCtrl = new UntypedFormControl();
  subject$: ReplaySubject<DocumentsVerification[]> = new ReplaySubject<DocumentsVerification[]>(1);
  documentsVerification: DocumentsVerification[];
 
  filterForm!: FormGroup;
  pageNumber: number = 1;
  totalRows: number;
  locFilterData:object | any;

  districtArray = [];
 
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize = 10;


  columns: TableColumn<DocumentsVerification>[] = [
    { label: 'Sr.No', property: 'srNo', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Event ID', property: 'eventCode', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Event Title', property: 'title', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Event Fee', property: 'eventFee', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Event Level', property: 'eventLevel', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Total Items', property: 'totalItem', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Event Created By', property: 'createdByName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    {label: 'Event Status', property: 'status', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Event Creation Date', property: 'createdDate', type: 'date', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
  ];

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  constructor(
    private apiService: ApiService, 
    private fb: FormBuilder,
    public commonService: CommonService, 
     private error: ErrorsService,
    public StaticDropdownService: StaticDropdownService,
    public configService:ConfigService,
    public validatorService: ValidatorService,
    private masterService: MasterService, 
  ) { }

  ngOnInit(): void {
    this.defultFilterform();
    this.getAllEventList();
    this.getDistrict();
  }

  defultFilterform() {
    this.filterForm = this.fb.group({
      // fromDate: [this.commonService.oneMonPrevDate()],
      // toDate: [this.commonService.todayDate()],
      // searchtext: [''],
      eventLevel: [this.locFilterData?.eventLevel || ''],
      districtId: [0],
      searchText: [this.locFilterData?.searchText || '']
    });
  }

  getDistrict() {
    this.masterService.getDistrict(0).subscribe({
      next: (response: []) => {
        this.districtArray.push({ district: "All District", id: 0 }, ...response);
      },
      error: (err => { this.error.handelError(err) })
    })
  }


  getAllEventList() {
    let formValue = this.filterForm.value;
    // formValue.fromDate = this.datePipe.transform(formValue.fromDate, 'YYYY/MM/dd');
    // formValue.toDate = this.datePipe.transform(formValue.toDate, 'YYYY/MM/dd');
    // let obj = "TextSearch=" + formValue.searchtext + "&StartDate=" + formValue.fromDate + "&EndDate=" + formValue.toDate + "&pageno=" + this.pageNumber + "&pagesize=" + 10;
    // const districtId = this.localstorageService.getLoggedInLocalstorageData()?.responseData;
    // let paramList: string = "?DistrictId=" + districtId?.districtId + "&pageno=" + this.pageNumber + "&pagesize=" + this.pageSize;

    let paramList: string = "?DistrictId=" + formValue.districtId + "&pageno=" + this.pageNumber + "&pagesize=" + this.pageSize;
    if (formValue?.eventLevel) paramList += "&EventLevel=" + formValue.eventLevel.trim();
    if (formValue?.searchText) paramList += "&Textsearch=" + formValue.searchText.trim();
    this.apiService.setHttp('get', "event-creation/getAll" + paramList +"&IsPublished=2", false, false, false, 'bidderUrl', true);
    this.apiService.getHttp().subscribe({
      next: (res: object) => {
        if (res['statusCode'] === "200") {
          this.dataSource = new MatTableDataSource(res['responseData'].responseData1);
          this.dataSource.sort = this.sort;
          this.totalRows = res['responseData'].responseData2;
          this.totalRows = this.totalRows[0].pageCount;
          this.pageNumber == 1 ? this.paginator?.firstPage() : '';
        } else {
          this.dataSource = null;
          this.totalRows = 0;
          if (res['statusCode'] != "404") {
            this.commonService.checkDataType(res['statusMessage']) == false ? this.error.handelError(res['statusCode']) : this.commonService.snackBar(res['statusMessage'], 1);
          }
        }
      },
      error: ((error: object) => {  this.error.handelError(error['status']) })
    });
  }

  onSubmit() {
    this.pageNumber = 1;
    this.getAllEventList();
  }


  pageChanged(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.getAllEventList();
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }
  // masterToggle() {
  //   this.isAllSelected() ?
  //     this.selection.clear() :
  //     this.dataSource.data.forEach(row => this.selection.select(row));
  // }
  // onLabelChange(change: MatSelectChange, row: DocumentsVerification) {
  //   const index = this.documentsVerification.findIndex(c => c === row);
  //   this.documentsVerification[index].labels = change.value;
  //   this.subject$.next(this.documentsVerification);
  // }

  getData() {
    this.pageNumber = 1;
    this.getAllEventList();
  }

  clearFilter() {
    this.defultFilterform();
  }

}
