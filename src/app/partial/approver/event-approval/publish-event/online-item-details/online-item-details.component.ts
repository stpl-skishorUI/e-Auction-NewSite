import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { OnlineItemDetails } from './online-item-details.model';
import { Location } from '@angular/common';

@Component({
  selector: 'vex-online-item-details',
  templateUrl: './online-item-details.component.html',
  styleUrls: ['./online-item-details.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class OnlineItemDetailsComponent implements OnInit {

  details:any;
  eventId: string;
  dataSource: any;
  pageNumber: number = 1;
  @ViewChild(MatSort) sort!: MatSort;
  onlineItemForm!: FormGroup | any;
  minDate = new Date()
  // @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;

  columns: TableColumn<OnlineItemDetails>[] = [
    { label: 'Sr.No', property: 'srNo', type: 'button', visible: true },
    { label: 'Plot Number/Name', property: 'itemName', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Mineral', property: 'material', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Taluka / CTSO', property: 'taluka', type: 'text', visible: false , cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Village',  property: 'village', type: 'text', visible: false , cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Latitude / Longitude', property: 'latitude/longitude', type: 'button', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Area', property: 'area', type: 'text', visible: false , cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Allowed Quantity', property: 'quantity', type: 'text', visible: true , cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Tender Fee', property: 'tender_ApplicationFee', type: 'text', visible: true , cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Security Deposit', property: 'emD_SecurityDeposit', type: 'text', visible: true , cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Offset Value', property: 'offsetValue', type: 'text', visible: true , cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Action', property: 'actions', type: 'button', visible: true , cssClasses: ['text-secondary', 'font-medium'] },
  ];

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }


  constructor(
    public location: Location,
    public commonService: CommonService,
    private apiService: ApiService,
   
    private error: ErrorsService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private localstorageService: LocalstorageService,
    private dialogService:DialogService
  ) { }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.params['id'];
    this.eventId ? (this.getData(), this.bindTable()) : '';
    this.deafultForm(); 
  }

  get onlineItemFormControls() { return this.onlineItemForm.controls }


  deafultForm() {
    this.onlineItemForm = this.fb.group({
      id: [+this.eventId],
      startDateTime: ['', [Validators.required]],
      endDateTime: ['', [Validators.required]],
      bidSubmissionStartDate: ['', [Validators.required]],
      bidSubmissionEndDate: ['', [Validators.required]],
      isPublished: [true],
      publishedBy: [this.localstorageService.userId()],
      publishedDatetime: [new Date],
      publishedRemark: [''],
    })
  }


  getData() {
    this.apiService.setHttp('get', "event-creation/" + this.eventId, false, false, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: object) => {
        if (res['statusCode'] === "200") {
          this.details = res['responseData'];

        } else {
          if (res['statusCode'] != "404") {
            this.commonService.checkDataType(res['statusMessage']) == false ? this.error.handelError(res['statusCode']) : this.commonService.snackBar(res['statusMessage'], 1);
          }
        }
      },
      error: ((error: object) => { this.error.handelError(error['status']) })
    });
  }


  // -----------------------   innner table Data  -------------------------------------//
  bindTable() {
   
    this.apiService.setHttp('get', "lot-creation/getByEventId/" + this.eventId, false, false, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: object) => {
        if (res['statusCode'] === "200") {
          this.dataSource = new MatTableDataSource(res['responseData']);
          this.dataSource.sort = this.sort;
          
        } else {
         
          this.dataSource = []
          // this.totalRows = 0;
          if (res['statusCode'] != "404") {
            this.commonService.checkDataType(res['statusMessage']) == false ? this.error.handelError(res['statusCode']) : this.commonService.snackBar(res['statusMessage'], 1);
          }
        }
      },
      error: ((error: object) => { this.error.handelError(error['status']) })
    });
  }
  // -----------------------   innner table End   -------------------------------------//



  onSubmit() {
    if (this.onlineItemForm.invalid) {
      return
    }
    let formData = this.onlineItemForm.value;
    let eventStartDateTime = this.commonService.dateWithTimeFormat(formData?.startDateTime);
    let eventEndDateTime = this.commonService.dateWithTimeFormat(formData?.endDateTime);
    let bidSubmissionStartDate = this.commonService.dateWithTimeFormat(formData?.bidSubmissionStartDate);
    let bidSubmissionEndDate = this.commonService.dateWithTimeFormat(formData?.bidSubmissionEndDate);

    formData['startDateTime'] =bidSubmissionStartDate;
    formData['endDateTime'] = bidSubmissionEndDate;
    formData['bidSubmissionStartDate'] =  eventStartDateTime;
    formData['bidSubmissionEndDate'] =  eventEndDateTime;
    formData['publishedDatetime'] = this.commonService.dateWithTimeFormat(new Date());
  
    this.apiService.setHttp('PUT', "event-creation/eventpublish", false, JSON.stringify(formData), false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: object) => {
        if (res['statusCode'] === "200") {
         
          this.commonService.successDialog(res['statusMessage'])
          this.commonService.routerLinkRedirect('/publish-event');
          this.clearform();
        } else {
         
          this.dataSource = []
          if (res['statusCode'] != "404") {
            this.commonService.checkDataType(res['statusMessage']) == false ? this.error.handelError(res['statusCode']) : this.commonService.snackBar(res['statusMessage'], 1);
          }
        }
      },
      error: ((error: object) => { this.error.handelError(error['status']) })
    });
  }

  clearform() {
    // this.formGroupDirective.resetForm();
    this.deafultForm();
  }

  onDateChange() {
    this.onlineItemForm.controls['bidSubmissionStartDate'].setValue('');
    this.onlineItemForm.controls['bidSubmissionEndDate'].setValue('');
  }


  eventDetails(data){
    let arrayObj = [
      { 'key': 'Plot Number and Plot Name', 'val': data.itemName, row: 1, tag: '<p> </p>', class: "", col: 1 },
      { 'key': 'Mineral', 'val': data.material, row: 1, tag: '<p> </p>', class: "", col: 1 },
      { 'key': 'Allowed Quantity', 'val': data.quantity, row: 1, tag: '<p> </p>', class: "", col: 1 },
      { 'key': 'Tender Fee', 'val': data.tender_ApplicationFee, row: 1, tag: '<p> </p>', class: "", col: 1 },
      { 'key': 'Security Deposit', 'val': data.emD_SecurityDeposit, row: 1, tag: '<p> </p>', class: "", col: 1 },  
    ]
    this.dialogService.detailsComponentDialog(arrayObj, 'Online Item Details', this.apiService.modalSize[2]); // call details dialog modal
  }


  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }


}
