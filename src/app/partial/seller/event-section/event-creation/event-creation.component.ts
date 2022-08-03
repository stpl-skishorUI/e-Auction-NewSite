import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { MasterService } from 'src/app/core/services/master.service';
import { StaticDropdownService } from 'src/app/core/services/static-dropdown.service';
import { ValidatorService } from 'src/app/core/services/validator.service';
@Component({
  selector: 'vex-event-creation',
  templateUrl: './event-creation.component.html',
  styleUrls: ['./event-creation.component.scss']
})
export class EventCreationComponent implements OnInit {

  layoutCtrl = new UntypedFormControl('boxed');
  eventCreationForm!: FormGroup | any;
  DocumentUrlUploaed: string;
  @ViewChild('myForm', { static: false }) myForm!: NgForm;
  @ViewChild('documentFile', { static: true }) documentFile!: ElementRef;
  eventTypeArray = [];
  selectLevelArray = [];
  saveUpdateBtn!: string;
  editFlag: boolean = false;
  eventId: number;;
  eventLevelId: string;

  constructor(
    public configService: ConfigService,
    private commonService: CommonService,
    private fb: FormBuilder,
    public valiService: ValidatorService,
    public apiService: ApiService,
    public errorSerivce: ErrorsService,
    public masterService: MasterService,
    public uploadFilesService: FileUploadService,
    private localstorageService: LocalstorageService,
    public staticDropdownService: StaticDropdownService,
    public dialogRef: MatDialogRef<EventCreationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.defaultForm();
    this.selEventLevel();
    this.getEventType();
    debugger;
    this.commonService.checkDataType(this.data) == true ? this.patchData() : '';

  }

  selEventLevel() {
    this.selectLevelArray = this.staticDropdownService.getSelectLevel(false);
    this.editFlag == true ? (this.getEventType()) : '';
    let typeOfUser = this.localstorageService.getLoggedInLocalstorageData().responseData?.subUserType;
    const sortedEventObj = this.selectLevelArray.find((ele: any) => { if (ele.val == typeOfUser.trim()) { return ele } });
    this.eventLevelId = sortedEventObj.val;
    this.eventCreationForm.controls['eventLevel'].setValue(this.eventLevelId)
  }
  get f() { return this.eventCreationForm.controls }

  defaultForm() {
    this.eventCreationForm = this.fb.group({
      eventTitle: ['', [Validators.required, Validators.pattern('^(.|\s)*[a-zA-Z]+(.|\s)*$')]],
      description: ['', [Validators.required, Validators.pattern('^(.|\s)*[a-zA-Z]+(.|\s)*$')]],
      eventType: ['', [Validators.required]],
      eventLevel: ['', [Validators.required]],
      eventFee: ['', [Validators.required]],
    })
  }

  patchData() {
    this.editFlag = true;
    this.eventId = this.data?.eventCode;
    this.DocumentUrlUploaed = this.data?.documentPath;
    this.saveUpdateBtn = 'Update';
    this.selEventLevel();
    this.eventCreationForm.patchValue({
      eventTitle: this.data?.title,
      description: this.data?.description,
      eventFee: this.data?.eventFee
    })
  }

  onSubmit() {
    let formData = this.eventCreationForm.value;
    if (this.eventCreationForm.invalid) {
      return;
    } else if (formData?.eventFee <= 0) {
      this.commonService.snackBar("Pleaser Enter valid fee", 1);
      return;
    } else if (!this.DocumentUrlUploaed) {
      this.commonService.snackBar("Please Upload Document..!!", 1);
      return;
    } else {
      let localStorageData = this.localstorageService.getLoggedInLocalstorageData().responseData;
      let obj = {
        "createdBy": this.localstorageService.userId(),
        "modifiedBy": this.localstorageService.userId(),
        "createdDate": new Date(),
        "modifiedDate": new Date(),
        "isDeleted": false,
        "id": this.editFlag == true ? this.data.id : 0,
        "eventCode": this.editFlag == true ? this.data.eventCode : "",
        "eventLevel": formData.eventLevel,
        "districtId": localStorageData?.districtId,
        "subDivisionId": localStorageData?.subDivisionId,
        "talukaId": localStorageData?.talukaId,
        "title": formData.eventTitle,
        "description": formData.description,
        "eventType": formData.eventType,
        "eventFee": parseInt(formData.eventFee),
        "documentPath": this.DocumentUrlUploaed,
        "projectId": localStorageData?.projectId,
        "applicationCounter": 0
      }
      let formType: string = this.editFlag == false ? 'POST' : 'PUT';
      this.apiService.setHttp(formType, 'event-creation', false, JSON.stringify(obj), false, 'bidderUrl');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          this.editFlag == false ? (this.onNoClick('Yes', res.statusMessage), this.commonService.successDialog(res.statusMessage)) : (this.dialogRef.close("Yes"), this.commonService.snackBar(res.statusMessage, 0));
          this.DocumentUrlUploaed = '';
          this.defaultForm();
        } else {
          this.commonService.snackBar(res.statusMessage, 1);
        }
      }, (error: any) => {
        this.errorSerivce.handelError(error.status);
      });
      this.clearEventForm();
    }
  }

  clearEventForm() {
    this.eventId = null;
    this.myForm.resetForm();
    this.DocumentUrlUploaed = '';
    this.eventCreationForm.controls['eventLevel'].setValue(this.eventLevelId);
  }

  documentUpload(event: any) {
    let DocumentUrl: any = this.uploadFilesService.uploadDocuments(event, "bidder", "png,jpg,jpeg,pdf", 5, 5000)
    DocumentUrl.subscribe((ele: any) => {
      this.DocumentUrlUploaed = ele.responseData;
    })
  }

  deleteDocument() {
    this.DocumentUrlUploaed = '';
    this.documentFile.nativeElement.value = '';
  }

  getEventType() {
    this.apiService.setHttp('get', "event-type/getAll", false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.eventTypeArray = res.responseData;
          this.editFlag == true ? this.eventCreationForm.controls['eventType'].setValue(this.data.eventType) : '';
        } else {
          this.eventTypeArray = [];
          this.commonService.checkDataType(res.statusMessage) == false ? this.errorSerivce.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
        }
      },
      error: ((error: any) => { this.errorSerivce.handelError(error.status) })
    });
  }

  onNoClick(flag: any, _msg: any): void {
    this.dialogRef.close(flag);
  }
}
