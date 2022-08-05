import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Location } from '@angular/common';
import { ApiService } from 'src/app/core/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { CommonService } from 'src/app/core/services/common.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { MatSort } from '@angular/material/sort';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { MatStepper } from '@angular/material/stepper';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from 'src/app/core/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'vex-eauction-event',
  templateUrl: './eauction-event.component.html',
  styleUrls: ['./eauction-event.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EauctionEventComponent implements OnInit {
  layoutCtrl = new UntypedFormControl('boxed');
  documentUploadedFlag: boolean = false;
  firstFormGroup: FormGroup | any;
  secondFormGroup: FormGroup | any;
  thirdFormGroup: FormGroup | any;
  forthFormGroup: FormGroup | any;
  dataSource: any;
  dataSource2: any;
  isLinear = true;
  dataSource7a: any
  displayedColumns6: string[] = ['SrNo', 'ItemNumberName', 'tenderNumber', 'TalukaCTSO', 'Village', 'LatitudeLongitude', 'Mineral', 'Area', 'AllowedQty', 'TenderFee', 'OffsetValue', 'EMD', 'ViewDetails'];
  dataSource7: any;
  columnsToDisplay7 = ['position', 'EventLevel', 'DistrictSDOTehsil', 'EventId', 'Title', 'Description', 'BidOpenDateTime', 'BidStartsIn', 'Count', 'Status', 'StartBidding'];
  expandedElement: any | null | undefined;
  displayedColumns7a: string[] = ['position', 'ItemNumberName', 'TenderNumber', 'TalukaCTSO', 'Village', 'LatitudeLongitude', 'Area', 'AllowedQuantity', 'EMD'];
  eventParticipateId!: number;
  eventParticipatedDetails: any;
  @ViewChild('stepper') private myStepper!: MatStepper;
  // ........................................ upload Document  variables declare Here ....................................//
  participatedDocArray: any;
  ParticipatedDetails: any;
  displayedEventDetails: string[] = ['SrNo', 'eventLevel', 'district', 'eventCode', 'title', 'description', 'bidSubmissionEndDate', 'bidSubmissionStartDate'];
  displayEventDetails: string[] = ['SrNo', 'eventLevel', 'district', 'eventCode', 'title', 'description', 'bidSubmissionEndDate', 'bidSubmissionStartDate', 'documentApprovedStatus'];
  documentDisplayColum: string[] = ['eventDocumentId', 'documentName', 'VerificationStatus', 'Upload'];
  dataSourceForEventDocument: any;
  participatedDocListArray: any[] = [];
  checkedDataflag: boolean = false;
  @ViewChild('fileInputPan', { static: false }) fileInputPan !: ElementRef;
  @ViewChild('docTblsort') docTblsort = new MatSort();
  @ViewChild('eventdetails1') eventdetails1 = new MatSort();
  // DocumentUrlUploaed: any;  // eventId: any;  
  byTenderDatasource: any;
  activeflag: boolean = true;
  eventParticipateIdCheck: any;
  payNowNewArray: any[] = [];

  constructor(
    private route: ActivatedRoute,
    public location: Location,
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    private errorsService: ErrorsService,
    public commonService: CommonService,
    public uploadFilesService: FileUploadService,
    private localstorageService: LocalstorageService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.eventParticipateId = this.route.snapshot.params['id'];
    this.getEventParticipateData();
    this.DefultForm();
  }

  DefultForm() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', [Validators.required]],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required],
    });
    this.forthFormGroup = this._formBuilder.group({
      forthCtrl: ['', Validators.required],
    });
  }

  // .......................................  common code start here .....................//

  getEventParticipateData() {
    this.apiService.setHttp("get", "event-participate/GetById?Id=" + this.eventParticipateId, false, false, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.eventParticipatedDetails = res.responseData;
          this.ParticipatedDetails = new MatTableDataSource([this.eventParticipatedDetails]);
          this.ParticipatedDetails.sort = this.eventdetails1
          this.activeflag == true && this.eventParticipatedDetails.isDocumentSubmitted == true ? (this.autoActiveTab(1), this.activeflag = false) : ""
          this.eventDocumentData();
        } else {
          this.commonService.checkDataType(res.statusMessage) == false ? this.errorsService.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
        }
      },
      error: ((error: any) => { this.errorsService.handelError(error.status) })
    });
  }

  tabChange(event: any) {
    if (event.selectedIndex == 0) {
      this.getEventParticipateData();
    } else if (event.selectedIndex == 1) {
      this.eventDocumentData();
    } else if (event.selectedIndex == 2) {
      this.getByEventId('tender');
    } else if (event.selectedIndex == 3) {
      this.getByEventId('emd');
    } else if (event.selectedIndex == 4) {

    }

  }

  autoActiveTab(val: number) { //send the particular tab 
    // debugger
    this.displayedColumns6
    switch (val) {
      case 1: {
        this.firstFormGroup.controls['firstCtrl'].setValue('1');
        this.myStepper.next()
        break;
      }
      case 1: {
        //statements; 
        break;
      }
      default: {
        //statements; 
        break;
      }
    }
  }
  // .......................................  common code End here .....................//





  //----------------------------------------- stepper 1 and 2 same code   -------------------------------//
  eventDocumentData() {
    this.apiService.setHttp("get", "event-document/GetByCriteria?EventId=" + this.eventParticipatedDetails.eventId + '&BidderId=' + this.localstorageService.getBidderId(), false, false, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.participatedDocArray = res.responseData;
          this.dataSourceForEventDocument = new MatTableDataSource(res.responseData);
          this.dataSourceForEventDocument.sort = this.docTblsort;
          const moveNextStep = this.participatedDocArray.every((ele: any) => {
            return ele.documentApprovedStatus == "Approved"
          });
          moveNextStep == true ? '' : '';
        } else {
          this.commonService.checkDataType(res.statusMessage) == false ? this.errorsService.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
        }
      },
      error: ((error: any) => { this.errorsService.handelError(error.status) })
    });
  }

  viewDocument(flag: any) {
    window.open(flag, '_blank');
  }

  //-----------------------------------------  stepper 1 and 2 same code End  here   -------------------------------//

  //------------------------------------------- stepper 1 functions start here ---------------------------------------------//
  documentUpload(event: any, element: any) {
    let documentUrl: any = this.uploadFilesService.uploadDocuments(event, "eacution", "png,jpg,jpeg,pdf", 5, 5000)
    documentUrl.subscribe((ele: any) => {
      const uploadImgPath = ele.responseData; // this.DocumentUrlUploaed = ele.responseData;
      this.objectDocument(element, uploadImgPath)
    });
  }

  objectDocument(ele: any, imagPath?: string) {
    if (this.commonService.checkDataType(imagPath) == true) {
      let obj = {
        'id': ele.id,
        "docTypeId": ele.documentId,
        "docType": ele.documentName,
        "docPath": imagPath,//this.DocumentUrlUploaed,
        "flag": true,
        'eventDocumentId': ele.eventDocumentId,
        'eventParticipateId': ele.eventParticipateId
      }
      this.checkUniqueData(obj, ele.documentId)
    } else {
      this.objectDocument(ele, imagPath)
    }
  }

  checkUniqueData(obj: any, docTypeId: any) { //Check Unique Data then Insert or Update
    this.checkedDataflag = true;
    if (this.participatedDocListArray.length <= 0) {
      this.participatedDocListArray.push(obj);
      this.checkedDataflag = false;
    } else {
      this.participatedDocListArray.map((ele: any, index: any) => {
        if (ele.docTypeId == docTypeId) {
          this.participatedDocListArray[index] = obj;
          this.checkedDataflag = false;
        }
      })
    }
    this.checkedDataflag && this.participatedDocListArray.length >= 1 ? this.participatedDocListArray.push(obj) : '';
    this.eventDocumentData();
  }

  deleteDocument(documnetId: any) {
    this.participatedDocListArray.map((ele: any, ind: number) => {
      if (ele.docTypeId == documnetId) {
        this.participatedDocListArray.splice(ind, 1);
        ele.flag = false;
      }
    })
    this.eventDocumentData();
  }

  // send  data to approval  
  stepperFirstSubmit(flag: any) {
    if (flag == 'firstCtrl') {
      this.participatedDocArray.find((ele: any) => {
        if (this.commonService.checkDataType(ele.documentPath) == true) {
          let tempObj = {
            "docTypeId": ele.documentId,
            "docType": ele.documentName,
            "docPath": ele.documentPath,
            "flag": true,
            'eventDocumentId': ele.eventDocumentId,
            "id": ele.id,
            "eventParticipateId": ele.eventParticipateId
          }
          this.participatedDocListArray.push(tempObj);
        }
      })
      if (this.participatedDocListArray.length == this.participatedDocArray.length) {
        this.firstFormGroup.controls['firstCtrl'].setValue('1');
        this.isLinear = true;
        this.uploadDocument();
      } else {
        if (this.firstFormGroup.controls?.firstCtrl?.status == 'INVALID') {
          this.commonService.snackBar("All documents are required", 1)
          this.firstFormGroup.controls['firstCtrl'].setValue('');
        }
      }
    }
  }

  uploadDocument() {
    let uploadDocumentArray: any[] = [];
    this.participatedDocListArray.forEach((ele: any) => {
      let obj = {
        "id": ele.id,
        "eventDocumentId": ele.eventDocumentId,
        "eventParticipateId": ele.eventParticipateId,
        "bidderId": this.localstorageService.getBidderId(),
        "documentNo": '',
        "documentDate": '',
        "documentPath": ele?.docPath,
        "isDeleted": false,
        'documentId': ele.docTypeId
      }
      uploadDocumentArray.push(obj)
    })
    this.apiService.setHttp('Post', "event-participate/UploadDocument", false, uploadDocumentArray, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.documentUploadedFlag = true;
          this.commonService.snackBar(res.statusMessage, 0);
          this.eventDocumentData();
        } else {
          this.dataSource = []
          if (res.statusCode != "404") {
            this.commonService.checkDataType(res.statusMessage) == false ? this.errorsService.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
          }
        }
      },
      error: ((error: any) => { this.errorsService.handelError(error.status) })
    });
  }
  //-------------------------------------------stepper 1 functions end here  ---------------------------------------//

  // --------------------------------------------  stepper 2 function  start here--------------------------------------//
  stepperSecoundSubmit() {
    const moveNextStep = this.participatedDocArray.every((ele: any) => {
      return ele.documentApprovedStatus == "Approved"
    });
    moveNextStep == true ? (this.secondFormGroup.controls['secondCtrl'].setValue('1'), this.myStepper.next()) : '';
  }
  // --------------------------------------------  stepper 2 function  end here --------------------------------------------//

  //---------------  common Code  stepper 3 & stepper 4 Start Here --------------//

  payNowArray: any = [];
  totalPayableAmount: number = 0;
  byTenderDetailsArray: any;

  getByEventId(flag:any) {
    this.payNowArray = [];
    this.apiService.setHttp('get', "lot-creation/getByEventId/" + this.eventParticipatedDetails.eventId, false, false, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.byTenderDetailsArray = res.responseData;
          this.addTender_EmdData(flag);
          this.byTenderDatasource = new MatTableDataSource(res.responseData);
        } else {
          if (res.statusCode != "404") {
            this.commonService.checkDataType(res.statusMessage) == false ? this.errorsService.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
          }
        }
      },
      error: ((error: any) => { this.errorsService.handelError(error.status) })
    });
  }

  addTender_EmdData(flag:any){ // find eventParticipateId > 0 and Show Totall Amount
    this.byTenderDetailsArray.find((ele: any) => {
      if (ele.eventParticipateId > 0 ) {
        let obj;
       if(flag == 'tender'){
        obj = {
          id: ele.itemId,
          isTender_ApplicationFeePaid: true,
          tenderFee: ele.tender_ApplicationFee
        } 
      }else if(flag == 'emd'){
        obj = {
          id: ele.itemId,
          isEMD_SecurityDepositPaid: true,
          tenderFee: ele.emD_SecurityDeposit
        } 
        } else{
          return;
        }
        this.payNowArray.push(obj);
        this.calculatePayableAnoumt();
      } else {
        this.eventParticipateIdCheck = false;
      }
    })
  }

  addforEventItemPayment(event: MatCheckboxChange, element: any , checkFlag:any) {
    let checkboxFlag = event.source.checked;
    if (checkboxFlag == true) {
      let obj;
      if(checkFlag == 'tender'){
        obj = {
          id: element.itemId,
          isTender_ApplicationFeePaid: true,
          tenderFee: element.tender_ApplicationFee
        }
      }else if(checkFlag == 'emd'){
        obj = {
          id: element.itemId,
          isEMD_SecurityDepositPaid: true,
          tenderFee: element.emD_SecurityDeposit
        } 
      } else{
        return;
      }
      this.payNowArray.push(obj);
    } else if (checkboxFlag == false) {
      let eventIdIndex = this.commonService.findIndexOfArrayObject(this.payNowArray, 'id', element.itemId);
      this.payNowArray.splice(eventIdIndex, 1);
      this.calculatePayableAnoumt();
    }
    this.payNowArray.length ? this.calculatePayableAnoumt() : ''
  }

  calculatePayableAnoumt() {
    const initialValue = 0;
    this.totalPayableAmount = this.payNowArray.reduce(function (previousValue: any, currentValue: any) {
      return previousValue + currentValue.tenderFee
    }, initialValue)
  }
  successDialog() {
    let dialog = this.dialog.open(SuccessDialogComponent, {
      // width: '340px',
      width: this.apiService.modalSize[1],
      data: { p1: 'Tender Fee / Application Fee', p2: '', cardTitle: '', successBtnText: 'Ok', dialogIcon: '', cancelBtnText: '', amount: this.totalPayableAmount },
      disableClose: this.apiService.disableCloseFlag,
    });
    dialog.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        this.thirdFormGroup.controls['thirdCtrl'].setValue('1');
        this.myStepper.next()
      }
    });
  }
  //--------  common Code  stepper 3 & stepper 4 END ------------//

  // -------------------------------------------  stepper 3 function start here --------------------------------------------//

  payTenderApplicationFee() {
    if (this.payNowArray.length) {
      var payNowNewArray = JSON.parse(JSON.stringify(this.payNowArray));
      for (var i = 0; i < payNowNewArray.length; i++) {
        delete payNowNewArray[i]['tenderFee'];
      }
      this.apiService.setHttp('PUT', "event-participate/UpdatepayTender_ApplicationFee", false, JSON.stringify(payNowNewArray), false, 'bidderUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {
          if (res.statusCode == '200') {
            this.successDialog();
          } else {
            this.commonService.snackBar(res.statusMessage, 1);
          }
        }
      })
    } else {
      this.commonService.snackBar('Please select one item', 1);
      this.thirdFormGroup.controls['thirdCtrl'].setValue('');
      return;
    }
  }

  // -------------------------------------------  stepper 3 function End here --------------------------------------------//  

  // -------------------------------------------  stepper 4 & Pay emd Code Start here --------------------------------------------//

  updatepayEMD() {
    if (this.payNowArray.length) {
      var payNowNewArray = JSON.parse(JSON.stringify(this.payNowArray));
      for (var i = 0; i < payNowNewArray.length; i++) {
        delete payNowNewArray[i]['tenderFee'];
      }
      this.apiService.setHttp('PUT', "event-participate/UpdatepayEMD", false, JSON.stringify(payNowNewArray), false, 'bidderUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {
          if (res.statusCode == '200') {
            this.successDialog();
          } else {
            this.commonService.snackBar(res.statusMessage, 1);
          }
        }
      })
    } else {
      this.commonService.snackBar('Please select one item', 1);
      // this.thirdFormGroup.controls['forthCtrl'].setValue('');
      return;
    }
  }
}
  // -------------------------------------------  stepper 4 & Pay emd Code End here --------------------------------------------//
