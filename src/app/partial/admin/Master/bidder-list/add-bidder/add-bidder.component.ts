import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidatorService } from 'src/app/core/services/validator.service';
// import { MapsAPILoader } from '@agm/core';
declare var google: any;
@Component({
  selector: 'vex-add-bidder',
  templateUrl: './add-bidder.component.html',
  styleUrls: ['./add-bidder.component.scss']
})
export class AddBidderComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource: any;

  bidderRegiForm!: FormGroup | any;
  verifyByForm!: FormGroup | any;
  submitted = false;
  submittedVerify = false;
  @ViewChild('formDirective')
  private formDirective!: NgForm;
  @ViewChild('formDirective1')
  private formDirective1!: NgForm;
  verifyByArray = ['PAN', 'Mobile'];
  hideByMobile: boolean = false;
  hideByPAN: boolean = true;
  bidderTypeArray = ['Individual', 'Organization'];
  hideIndividual: boolean = true;
  hideOrganization: boolean = false;
  organTypeArray: any[] = [];
  districtArray: any[] = [];
  DesignationArray: any[] = [];
  BidderRegByCriteriaArray: any[] = [];
  bidderTypeName = 'Individual';
  acceptedOnlyNumbers: any;
  designationName: any;
  bidderDocumentListArray: any[] = [];
  PartnershipDeedCerti_Hide: boolean = false;
  disableDiv: boolean = false;

  panSymbolHide: boolean = false;
  aadharSymbolHide: boolean = false;
  gstSymbolHide: boolean = false;
  incCertiSymbolHide: boolean = false;
  SALBodyCertiSymbolHide: boolean = false;
  PDCertiSymbolHide: boolean = false;

  checkedDataflag: boolean = true;
  verfiedOTPId: number = 0;

  @ViewChild('fileInputPan') fileInputPan!: ElementRef;
  @ViewChild('fileInputAadhar') fileInputAadhar!: ElementRef;
  @ViewChild('fileInputGst') fileInputGst!: ElementRef;
  @ViewChild('fileInputIC') fileInputIC!: ElementRef;
  @ViewChild('fileInputSALBC') fileInputSALBC!: ElementRef;
  @ViewChild('fileInputPDC') fileInputPDC!: ElementRef;

  latitude: any;
  longitude: any;
  pinCode: any;
  geocoder: any;
  @ViewChild('search') public searchElementRef!: ElementRef;

  sentOtpText = 'Send OTP';
  checkLoginOrNot: any;
  mobileOtp: any;
  
  constructor(
    // public spinner: NgxSpinnerService,
    private commonService: CommonService,
    private fb: FormBuilder,
    public valiService: ValidatorService,
    public apiService: ApiService,
    public errorSerivce: ErrorsService,
    public masterService: MasterService,
    private localstorageService: LocalstorageService,
    public uploadFilesService: FileUploadService,
    public configService:ConfigService,
    // private mapsAPILoader: MapsAPILoader,
    // private ngZone: NgZone,
    @Optional() public dialogRef: MatDialogRef<AddBidderComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.acceptedOnlyNumbers = this.valiService.acceptedOnlyNumbers;
    this.checkLogin();
    this.defaultForm();
    this.commonService.checkDataType(this.data) == true ? (this.data ,this.editBidderForm(this.data)): '';
    this.verifyBy_Form();
    this.getOrganizationtype();
    this.getDistrict();
    this.getDesignation();
    this.searchAddressToPincode();
  }

  checkLogin() {
    this.checkLoginOrNot = this.commonService.checkDataType(this.localstorageService?.userId());
    this.checkLoginOrNot == true ? this.disableDiv = false : this.disableDiv = true;
  }

  get v() { return this.verifyByForm.controls }

  verifyBy_Form() {
    this.verifyByForm = this.fb.group({
      panNumber: ['', [Validators.required, Validators.pattern('[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}')]],
      mobileNo: [''],
    })
  }

  get f() { return this.bidderRegiForm.controls }

  defaultForm() {
    this.bidderRegiForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.pattern(this.valiService.valName)]],
      mobile: ['', [Validators.required, Validators.pattern(this.valiService.valMobileNo)]],
      stateId: [''],
      districtId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(this.valiService.valEmailId)]],
      address: ['', [Validators.required, Validators.pattern('^[^[ ]+|[ ][gm]+$')]],
      pinCode: ['', [Validators.required, Validators.pattern(this.valiService.valPinCode)]],
      designation: ['', Validators.required],
      organizationTypeId: [''],
      contactPersonName: [''],
      contactPersonMobile: ['', Validators.pattern(this.valiService.valMobileNo)],

      accountHolderName: ['', this.checkLoginOrNot == false ? [Validators.required, Validators.pattern('^[^\\s0-9\\[\\[`&._@#%*!+"\'\/\\]\\]{}][a-zA-Z.\\s]+$')] : [Validators.pattern('^[^\\s0-9\\[\\[`&._@#%*!+"\'\/\\]\\]{}][a-zA-Z.\\s]+$')]],
      accountNo: ['', this.checkLoginOrNot == false ? [Validators.required, Validators.pattern('[0-9]{9,18}')] : [Validators.pattern('[0-9]{9,18}')]],
      bankName: ['', this.checkLoginOrNot == false ? [Validators.required, Validators.pattern(this.valiService.valName)] : [Validators.pattern(this.valiService.valName)]],
      ifscCode: ['', this.checkLoginOrNot == false ? [Validators.required, Validators.pattern('^[A-Za-z]{4}[a-zA-Z0-9]{7}$')] : [Validators.pattern('^[A-Za-z]{4}[a-zA-Z0-9]{7}$')]],
      branchName: ['', this.checkLoginOrNot == false ? [Validators.required, Validators.pattern(this.valiService.valName)] : [Validators.pattern(this.valiService.valName)]],
      verfiedOTPId: ['', this.checkLoginOrNot == false ? [Validators.required, Validators.pattern('^[0-9]{5,5}$')] : [Validators.pattern('^[0-9]{5,5}$')]],

      panNo: ['', [Validators.required, Validators.pattern(this.valiService.vaPanNo)]],
      aadharNo: ['', [Validators.pattern(this.valiService.valAadharNo)]],
      gstNo: ['', Validators.pattern(this.valiService.valGstNo)],
      incorporationCerti_No: ['', Validators.pattern('^[a-zA-Z0-9]{21,21}$')],
      incorporation_Date: [''],
      SALocalBodyCerti_No: ['', Validators.pattern('^[0-9]{15,15}$')],
      partnershipDeedCerti_No: [''],
    })
  }

  verifyByPAN_M(flag: any) {
    flag == 'PAN' ? (this.hideByPAN = true, this.hideByMobile = false) : (this.hideByMobile = true, this.hideByPAN = false);
    this.sentOtpText = 'Send OTP';
    this.disableDiv = true;
    this.defaultForm();
    this.formDirective && this.formDirective.resetForm();
    this.formDirective1 && this.formDirective1.resetForm();
    this.addRemoveVali_VerifyByPAN_M(flag);
    this.defaultDocSymbolHide();
    this.bidderDocumentListArray = [];
    this.defaultfilenativeElementClear();
  }

  addRemoveVali_VerifyByPAN_M(flag: any) {
    if (flag == 'PAN') {
      this.verifyByForm.controls['mobileNo'].setValue('');
      this.verifyByForm.controls['mobileNo'].clearValidators();
      this.verifyByForm.controls['mobileNo'].updateValueAndValidity();
      this.verifyByForm.controls["panNumber"].setValidators([Validators.required, Validators.pattern('[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}')]);
      this.verifyByForm.controls["panNumber"].updateValueAndValidity();
    } else {
      this.verifyByForm.controls['panNumber'].setValue('');
      this.verifyByForm.controls['panNumber'].clearValidators();
      this.verifyByForm.controls['panNumber'].updateValueAndValidity();
      this.verifyByForm.controls["mobileNo"].setValidators([Validators.required, Validators.pattern('[6-9]\\d{9}')]);
      this.verifyByForm.controls["mobileNo"].updateValueAndValidity();
    }
  }

  bidderTypeCheck(flag: any) {
    this.bidderTypeName = flag;
    this.formDirective && this.formDirective.resetForm();
    this.defaultForm();
    this.data ? this.bidderRegiForm.controls['id'].setValue(this.data?.bidderId) : this.bidderRegiForm.controls['id'].setValue(0); //When data update & call clear function set id
    flag == 'Individual' ? (this.hideIndividual = true, this.hideOrganization = false) : (this.hideOrganization = true, this.hideIndividual = false, this.PartnershipDeedCerti_Hide = false);
    this.sentOtpText = 'Send OTP';
    this.addRemoveVali_BidderTypeCheck(flag);
    this.defaultDocSymbolHide();
    this.bidderDocumentListArray = [];
    this.defaultfilenativeElementClear();
  }

  addRemoveVali_BidderTypeCheck(flag: any) {
    if (flag == 'Individual') {
      this.bidderRegiForm.controls['organizationTypeId'].setValue('');
      this.bidderRegiForm.controls['organizationTypeId'].clearValidators();
      this.bidderRegiForm.controls['organizationTypeId'].updateValueAndValidity();
      this.bidderRegiForm.controls['contactPersonName'].setValue('');
      this.bidderRegiForm.controls['contactPersonName'].clearValidators();
      this.bidderRegiForm.controls['contactPersonName'].updateValueAndValidity();
      this.bidderRegiForm.controls["designation"].setValidators(Validators.required);
      this.bidderRegiForm.controls["designation"].updateValueAndValidity();
    } else {
      this.bidderRegiForm.controls['designation'].setValue('');
      this.bidderRegiForm.controls['designation'].clearValidators();
      this.bidderRegiForm.controls['designation'].updateValueAndValidity();
      this.bidderRegiForm.controls["organizationTypeId"].setValidators(Validators.required);
      this.bidderRegiForm.controls["organizationTypeId"].updateValueAndValidity();
      this.bidderRegiForm.controls["contactPersonName"].setValidators([Validators.required, Validators.pattern('^[^\\s0-9\\[\\[`&._@#%*!+"\'\/\\]\\]{}][a-zA-Z.\\s]+$')]);
      this.bidderRegiForm.controls["contactPersonName"].updateValueAndValidity();
    }
  }

  orgTypeHideTableRow() {
    if (this.bidderRegiForm.value.organizationTypeId == 2 || this.bidderRegiForm.value.organizationTypeId == 3) {
      this.PartnershipDeedCerti_Hide = true;
      this.bidderRegiForm.controls["partnershipDeedCerti_No"].setValidators(Validators.pattern('^[0-9]{15,15}$'));
      this.bidderRegiForm.controls["partnershipDeedCerti_No"].updateValueAndValidity();
    } else {
      this.PartnershipDeedCerti_Hide = false;
      this.bidderRegiForm.controls['partnershipDeedCerti_No'].setValue('');
      this.bidderRegiForm.controls['partnershipDeedCerti_No'].clearValidators();
      this.bidderRegiForm.controls['partnershipDeedCerti_No'].updateValueAndValidity();
    }
  }

  defaultDocSymbolHide() {
    this.panSymbolHide = false;
    this.aadharSymbolHide = false;
    this.gstSymbolHide = false;
    this.incCertiSymbolHide = false;
    this.SALBodyCertiSymbolHide = false;
    this.PDCertiSymbolHide = false;
  }

  defaultfilenativeElementClear() {
    if (this.fileInputPan?.nativeElement.value || this.fileInputAadhar?.nativeElement.value || this.fileInputGst?.nativeElement.value || this.fileInputIC?.nativeElement.value || this.fileInputSALBC?.nativeElement?.value || this.fileInputPDC?.nativeElement.value) {
      this.fileInputPan.nativeElement.value = '';
      this.fileInputAadhar.nativeElement.value = '';
      this.fileInputGst.nativeElement.value = '';
      this.fileInputIC.nativeElement.value = '';
      this.fileInputSALBC.nativeElement.value = '';
      this.fileInputPDC.nativeElement.value = '';
    }
  }

  Incorp_Certificate() { // Add Validation Incorporation Certificate 
    if (this.bidderTypeName == 'Organization' && this.bidderRegiForm.controls['incorporationCerti_No'].valid
      && this.commonService.checkDataType(this.bidderRegiForm.value.incorporationCerti_No) == true) {
      this.bidderRegiForm.controls["incorporation_Date"].setValidators(Validators.required);
      this.bidderRegiForm.controls["incorporation_Date"].updateValueAndValidity();
    }

    if (this.bidderTypeName == 'Organization' && this.commonService.checkDataType(this.bidderRegiForm.value.incorporation_Date) == true) {
      this.bidderRegiForm.controls["incorporationCerti_No"].setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9]{21,21}$')]);
      this.bidderRegiForm.controls["incorporationCerti_No"].updateValueAndValidity();
    }

    if (this.bidderTypeName == 'Organization' && this.commonService.checkDataType(this.bidderRegiForm.value.incorporationCerti_No) == false
      && this.commonService.checkDataType(this.bidderRegiForm.value.incorporation_Date) == false) {
      this.bidderRegiForm.controls['incorporation_Date'].clearValidators();
      this.bidderRegiForm.controls['incorporation_Date'].updateValueAndValidity();
      this.bidderRegiForm.controls['incorporationCerti_No'].clearValidators();
      this.bidderRegiForm.controls['incorporationCerti_No'].updateValueAndValidity();
    }
  }

  onSubmit() {
    this.addDocumentNumber();
    this.addDocumentNumberNew();
    this.Incorp_Certificate();
    let localstorData = this.checkLoginOrNot == true ? this.localstorageService.getLoggedInLocalstorageData().responseData : '';
    if (this.bidderRegiForm.invalid) {
      window.scroll(0, 0);
      return;
    } else if (this.panSymbolHide != true) {
      this.commonService.snackBar("PAN Document is Required..!!!", 1);
      this.commonService.scrollBar(400);
      return;
    }
    else if (this.checkLoginOrNot == false ? (this.bidderRegiForm.value.verfiedOTPId != this.mobileOtp) : '') {
      this.commonService.snackBar("Please Enter Valid Otp Field..!!!", 1);
      return;
    }
    else {
      // this.addDocumentNumber();
      // this.addDocumentNumberNew();
      let formData = this.bidderRegiForm.value;
      this.DesignationArray.map((ele: any) => {
        if (formData.designation == ele.id) {
          this.designationName = ele.designation;
        }
      })
      let obj = {
        "createdBy": 0,
        "modifiedBy": 0,
        "createdDate": new Date,
        "modifiedDate": new Date,
        "isDeleted": false,
        "id": formData.id,
        "bidderType": this.bidderTypeName,
        "name": formData.name,
        "mobile": formData.mobile,
        "stateId": this.checkLoginOrNot == true ? localstorData?.stateId : 1,
        "districtId": formData.districtId,
        "email": formData.email,
        "address": formData.address,
        "pinCode": formData.pinCode,
        "designation": this.designationName,
        "organizationTypeId": parseInt(formData.organizationTypeId) || 0,
        "contactPersonName": formData.contactPersonName,
        "contactPersonMobile": formData.contactPersonMobile,
        "verfiedOTPId": this.verfiedOTPId,
        "projectId": this.checkLoginOrNot == true ? localstorData?.projectId : 2,
        "designationId": formData.designation || 0,
        "bidderRefundAccount": {
          "createdBy": 0,
          "modifiedBy": 0,
          "createdDate": new Date,
          "modifiedDate": new Date,
          "isDeleted": false,
          "id": 0,
          "bidderId": 0,
          "accountHolderName": formData.accountHolderName,
          "accountNo": formData.accountNo,
          "bankName": formData.bankName,
          "ifscCode": formData.ifscCode,
          "branchName": formData.branchName
        },
        "bidderDocumentslst": this.bidderDocumentListArray
      }
      let formType = this.data ? 'PUT' : 'POST';
      this.apiService.setHttp(formType, 'bidder-registration', false, JSON.stringify(obj), false, 'bidderUrl');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          formType == 'POST' ? this.commonService.successDialog(res.statusMessage) : this.commonService.snackBar(res.statusMessage, 0);
          this.checkLoginOrNot = true ? this.dialogRef.close(true) : '';
          this.verifyBy_Form();
          this.defaultForm();
          this.disableDiv = true;
          this.defaultDocSymbolHide();
          this.sentOtpText = 'Send OTP';
        } else {
          this.commonService.snackBar(res.statusMessage, 1);
        }
      }, (error: any) => {
        this.errorSerivce.handelError(error.status);
      });
      this.clearForm();
    }
  }

  editBidderForm(data:any){ // Patch Data
    console.log(data?.bidderType)
    this.bidderTypeName = data?.bidderType; // add for radio button
    this.bidderTypeCheck(data?.bidderType);
    this.bidderRegiForm.patchValue({
      id : data?.bidderId,
      name: data?.name,
      mobile: data?.mobile,
      stateId: data?.stateId,
      districtId: data?.districtId,
      email: data?.email,
      address: data?.address,
      pinCode: data?.pinCode,
      designation: data?.designationId,
      organizationTypeId: data?.organizationTypeId,
      contactPersonName: data?.contactPersonName,
      contactPersonMobile: data?.contactPersonMobile,
    })
    this.bidderDocumentListArray = data?.bidderUserDocuments;
    this.documentSymbolHide();
    this.bidderDocumentListArray.map((ele:any)=>{
      switch (ele.docTypeId) {
        case 1: this.bidderRegiForm.controls['panNo'].setValue(ele.docNo); break;
        case 2: this.bidderRegiForm.controls['aadharNo'].setValue(ele.docNo); break;
        case 3: this.bidderRegiForm.controls['gstNo'].setValue(ele.docNo); break;
        case 4: this.bidderRegiForm.controls['incorporationCerti_No'].setValue(ele.docNo);this.bidderRegiForm.controls['incorporation_Date'].setValue(ele.documentDate); break;
        case 5: this.bidderRegiForm.controls['SALocalBodyCerti_No'].setValue(ele.docNo); break;
        case 6: this.bidderRegiForm.controls['partnershipDeedCerti_No'].setValue(ele.docNo); break;
        default:
      }
    })
     console.log('');
     ((data?.organizationTypeId == 2) || (data?.organizationTypeId == 3)) ? this.orgTypeHideTableRow() : '';
  
  }

  clearForm() {
    this.bidderRegiForm.reset();
    this.formDirective && this.formDirective.resetForm();
    this.data ? this.bidderRegiForm.controls['id'].setValue(this.data?.bidderId) : this.bidderRegiForm.controls['id'].setValue(0);//When data update & call clear function set id
    this.defaultDocSymbolHide();
    this.bidderDocumentListArray = [];
    this.sentOtpText = 'Send OTP';
    this.checkLoginOrNot == true ? this.disableDiv = false : this.disableDiv = true;
  }

  getOrganizationtype() {
    this.masterService.getOrganizationType().subscribe({
      next: (response: any) => {
        this.organTypeArray.push({ organizationName: "Select Orgination Type", organizationId: 0 }, ...response);
      },
      error: (err => { this.errorSerivce.handelError(err) })
    })
  }

  getDistrict() {
    this.masterService.getDistrict(0).subscribe({
      next: (response: any) => {
        this.districtArray.push({ district: "Select District", id: 0 }, ...response);
      },
      error: (err => { this.errorSerivce.handelError(err) })
    })
  }

  getDesignation() {
    this.apiService.setHttp('get', "designation/GetAll", false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          // this.spinner.hide();
          this.DesignationArray = res.responseData;
          this.DesignationArray = [{ designation: "Select Designation", id: 0 }, ...res.responseData];
        } else {
          // this.spinner.hide();
          this.DesignationArray = [];
          this.commonService.checkDataType(res.statusMessage) == false ? this.errorSerivce.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
        }
      },
      error: ((error: any) => { this.errorSerivce.handelError(error.status) })
    });
  }

  getBidderRegByCriteria() {
    if (this.verifyByForm.invalid) {
      return;
    }
    let obj = 'Mobile=' + this.verifyByForm.value.mobileNo + '&PAN=' + this.verifyByForm.value.panNumber;
    this.apiService.setHttp('get', "bidder-registration/getbyCriteria?" + obj, false, false, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          // this.spinner.hide();
          this.BidderRegByCriteriaArray = res.responseData;
          this.disableDiv = true;
          this.verifyByForm.value.mobileNo ? this.commonService.snackBar('Mobile Number Is Already Registerd', 1) :
            this.commonService.snackBar('PAN Number Is Already Registerd', 1);
        } else {
          // this.spinner.hide();
          this.BidderRegByCriteriaArray = [];
          this.commonService.checkDataType(res.statusMessage) == false ? this.errorSerivce.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
          this.disableDiv = false;
          this.verifyByForm.value.mobileNo ? this.bidderRegiForm.controls['mobile'].setValue(this.verifyByForm.value.mobileNo) :
            this.bidderRegiForm.controls['panNo'].setValue(this.verifyByForm.value.panNumber.toUpperCase());
        }
      },
      error: ((error: any) => { this.errorSerivce.handelError(error.status) })
    });
  }

  getBidderRegByCriSeprated(flag: any) { // blur to check mobile and PAN is registerd or not
    let mobile: any, PanNo: any;
    flag == 'PAN' ? (PanNo = this.bidderRegiForm.value.panNo, mobile = '') : (mobile = this.bidderRegiForm.value.mobile, PanNo = '')

    if (mobile?.length == 10 || PanNo?.length == 10) {
      let obj = 'Mobile=' + mobile + '&PAN=' + PanNo;
      this.apiService.setHttp('get', "bidder-registration/getbyCriteria?" + obj, false, false, false, 'bidderUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {
          if (res.statusCode === "200") {
            mobile ? this.commonService.snackBar('Mobile Number Is Already Registerd', 1) :
              this.commonService.snackBar('PAN Number Is Already Registerd', 1);
          } else {
            this.commonService.checkDataType(res.statusMessage) == false ? this.errorSerivce.handelError(res.statusCode) : '';
          }
        },
        error: ((error: any) => { this.errorSerivce.handelError(error.status) })
      });
    }
  }

  // ...........................................  Document Upload Code Start Here ......................................//

  documentUpload(event: any, docTypeId: any, docTypeName: any) {
    let documentUrlUploaed: any;  
    let documentUrl: any = this.uploadFilesService.uploadDocuments(event, "bidder", "png,jpg,jpeg,pdf", 5, 5000)
    documentUrl.subscribe({
      next: (ele: any) => {
        documentUrlUploaed = ele.responseData;
        if (documentUrlUploaed != null) {
          let obj = {
            'fileData': event,
            "id": 0,
            "entity": "",
            "refId": 0,
            "docTypeId": docTypeId,
            "docType": docTypeName,
            "docNo": '',
            "docPath": documentUrlUploaed,
            "uploadDocPath": '',
            "filename": '',
            "documentDate": new Date,
            "remark": "",
            "createdBy": 0,
            "createdDate": new Date,
            "isDeleted": false
          }
          this.checkUniqueData(obj, docTypeId);
        }
      },
    })
  }

  checkUniqueData(obj: any, docTypeId: any) { //Check Unique Data then Insert or Update
    this.checkedDataflag = true;
    if (this.bidderDocumentListArray.length <= 0) {
      this.bidderDocumentListArray.push(obj);
      this.checkedDataflag = false;
    } else {
      this.bidderDocumentListArray.map((ele: any, index: any) => {
        if (ele.docTypeId == docTypeId) {
          this.bidderDocumentListArray[index] = obj;
          this.checkedDataflag = false;
        }
      })
    }
    this.checkedDataflag && this.bidderDocumentListArray.length >= 1 ? this.bidderDocumentListArray.push(obj) : '';
    this.documentSymbolHide();
  }

  documentSymbolHide() {
    if (this.bidderDocumentListArray.length > 0) {
      this.bidderDocumentListArray.map((ele: any) => {
        switch (ele.docType) {
          case 'PAN': this.panSymbolHide = true; break;
          case 'Aadhar': this.aadharSymbolHide = true; break;
          case 'GST': this.gstSymbolHide = true; break;
          case 'incorporationCerti_No': this.incCertiSymbolHide = true; break;
          case 'Shop Act/ Local Body Certificate': this.SALBodyCertiSymbolHide = true; break;
          case 'Partnership Deed Certificate': this.PDCertiSymbolHide = true; break;
          default:
        }
      })
    }
  }

  deleteDocument(flag: any) {
    this.bidderDocumentListArray.splice(this.bidderDocumentListArray.findIndex(a => a.docTypeId === flag), 1);
    switch (flag) {
      case 1: this.panSymbolHide = false, this.fileInputPan.nativeElement.value = ''; break;
      case 2: this.aadharSymbolHide = false, this.fileInputAadhar.nativeElement.value = ''; break;
      case 3: this.gstSymbolHide = false, this.fileInputGst.nativeElement.value = ''; break;
      case 4: this.incCertiSymbolHide = false, this.fileInputIC.nativeElement.value = ''; break;
      case 5: this.SALBodyCertiSymbolHide = false, this.fileInputSALBC.nativeElement.value = ''; break;
      case 6: this.PDCertiSymbolHide = false, this.fileInputPDC.nativeElement.value = ''; break;
      default:
    }
  }

  viewDocument(flag: any) {
    this.bidderDocumentListArray.find((ele: any) => {
      if (ele.docTypeId == flag) {
        window.open(ele.docPath, '_blank');
      }
    })
  }

  //..... Document Number Code Start Here...... //

  addDocumentNumber() { // Add Document Number In bidderDocumentListArray
    const controls = this.bidderRegiForm.controls;
    this.bidderDocumentListArray.map((ele: any) => {
      if (controls['panNo'].valid && ele.docTypeId == 1) {
        ele.docNo = this.bidderRegiForm.value.panNo.toUpperCase();
      } else if (controls['aadharNo'].valid && ele.docTypeId == 2) {
        ele.docNo = this.bidderRegiForm.value.aadharNo;
      } else if (controls['gstNo'].valid && ele.docTypeId == 3) {
        ele.docNo = this.bidderRegiForm.value.gstNo.toUpperCase();
      } else if (controls['incorporationCerti_No'].valid && ele.docTypeId == 4) {
        ele.docNo = this.bidderRegiForm.value.incorporationCerti_No.toUpperCase();
      } else if (controls['SALocalBodyCerti_No'].valid && ele.docTypeId == 5) {
        ele.docNo = this.bidderRegiForm.value.SALocalBodyCerti_No;
      } else if (controls['partnershipDeedCerti_No'].valid && ele.docTypeId == 6) {
        ele.docNo = this.bidderRegiForm.value.partnershipDeedCerti_No;
      }
    })
  }

  addDocumentNumberNew() { //is it not Upload document file then push obj only document Number
    let Aadhar: boolean = true;
    let GST: boolean = true;
    let IncorCerti: boolean = true;
    let ShopActLBCerti: boolean = true;
    let PartDCerti: boolean = true;

    this.bidderDocumentListArray.map((ele: any) => {
      switch (ele.docType) {
        case 'Aadhar': Aadhar = false; break;
        case 'GST': GST = false; break;
        case 'incorporationCerti_No': IncorCerti = false; break;
        case 'Shop Act/ Local Body Certificate': ShopActLBCerti = false; break;
        case 'Partnership Deed Certificate': PartDCerti = false; break;
        default:
      }
    })

    const controls = this.bidderRegiForm.controls;
    if (controls['aadharNo'].valid && this.bidderRegiForm.value.aadharNo != '' && Aadhar) {
      this.documentNumberObj(this.bidderRegiForm.value.aadharNo, 2);
    }
    if (controls['gstNo'].valid && this.bidderRegiForm.value.gstNo != '' && GST) {
      this.documentNumberObj(this.bidderRegiForm.value.gstNo, 3);
    }
    if (controls['incorporationCerti_No'].valid && this.bidderRegiForm.value.incorporationCerti_No != '' && IncorCerti) {
      this.documentNumberObj(this.bidderRegiForm.value.incorporationCerti_No, 4);
    }
    if (controls['SALocalBodyCerti_No'].valid && this.bidderRegiForm.value.SALocalBodyCerti_No != '' && ShopActLBCerti) {
      this.documentNumberObj(this.bidderRegiForm.value.SALocalBodyCerti_No, 5);
    }
    if (controls['partnershipDeedCerti_No'].valid && this.bidderRegiForm.value.partnershipDeedCerti_No != '' && PartDCerti) {
      this.documentNumberObj(this.bidderRegiForm.value.partnershipDeedCerti_No, 6);
    }
  }

  documentNumberObj(docNo: any, docTypeId: any) {
    let docDate = (this.bidderRegiForm.controls['incorporationCerti_No'].valid && this.bidderRegiForm.value.incorporationCerti_No != '') ? this.bidderRegiForm.value.incorporation_Date : new Date;
    let obj = {
      'fileData': '',
      "id": 0,
      "entity": "",
      "refId": 0,
      "docTypeId": docTypeId,
      "docType": '',
      "docNo": docNo,
      "docPath": '',
      "uploadDocPath": '',
      "filename": '',
      "documentDate": docDate,
      "remark": "",
      "createdBy": 0,
      "createdDate": new Date,
      "isDeleted": false
    }
    this.checkUniqueData(obj, docTypeId);
  }
  //..... Document Number Code End Here...... //

  // ...........................................  Document Upload Code End Here ......................................//

  //.........................................Address to get Pincode Code Start Here ..................................................//

  searchAddressToPincode() {
    // this.mapsAPILoader.load().then(() => {
    //   this.geocoder = new google.maps.Geocoder();
    //   let autocomplete = new google.maps.places.Autocomplete(
    //     this.searchElementRef.nativeElement
    //   );
    //   autocomplete.addListener('place_changed', () => {
    //     this.ngZone.run(() => {
    //       let place: google.maps.places.PlaceResult = autocomplete.getPlace();
    //       if (place.geometry === undefined || place.geometry === null) {
    //         return;
    //       }
    //       this.latitude = place.geometry.location.lat();
    //       this.longitude = place.geometry.location.lng();
    //       this.findAddressByCoordinates();
    //     });
    //   });
    // });
  }

  findAddressByCoordinates() {
    this.geocoder.geocode(
      { location: { lat: this.latitude, lng: this.longitude, } },
      (results: any) => {
        results[0].address_components.forEach((element: any) => {
          this.pinCode = element.long_name;
          this.bidderRegiForm.controls['pinCode'].setValue(this.pinCode);
        });
      });
  }

  //.........................................Address to get Pincode Code End Here ....................................//
  close(answer: string) {
    this.dialogRef.close(answer);
  }
  
  // ...........................................  Sent Otp Code Start Here ........................................//

  sentOtpMobile() {
    this.bidderRegiForm.controls['verfiedOTPId'].setValue('');
    if (this.bidderRegiForm.controls['mobile'].status == 'VALID') {
      let obj = {
        "createdBy": 0,
        "modifiedBy": 0,
        "createdDate": new Date(),
        "modifiedDate": new Date(),
        "isDeleted": true,
        "id": 0,
        "mobileNo": this.bidderRegiForm.value.mobile,
        "otp": "",
        "pageName": "Bidder",
        "otpExpireDate": new Date(),
        "isUser": false
      }
      this.apiService.setHttp('POST', 'otp-tran', false, JSON.stringify(obj), false, 'masterUrl');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          this.sentOtpText = 'Resend OTP'
          this.commonService.snackBar(res.statusMessage, 1);
          this.getOtpByMobileNo(this.bidderRegiForm.value.mobile, 'Bidder');
        } else {
          this.commonService.snackBar(res.statusMessage, 0);
        }
      }, (error: any) => {
        this.errorSerivce.handelError(error.status);
      });
    } else {
      this.commonService.snackBar('Please Check Mobile Number Field..!!!', 1);
    }
  }

  getOtpByMobileNo(mobileNo: any, PageName: any) {
    let obj = 'MobileNo=' + mobileNo + '&PageName=' + PageName;
    this.apiService.setHttp('get', "otp-tran/GetOtpByMobileNo?" + obj, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.verfiedOTPId = res.responseData[0].id;
          this.mobileOtp = res.responseData[0].otp;
          alert('Otp : ' + this.mobileOtp);
        } else {
          // this.spinner.hide();
          this.commonService.checkDataType(res.statusMessage) == false ? this.errorSerivce.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
        }
      },
      error: ((error: any) => { this.errorSerivce.handelError(error.status) })
    });
  }

  // ...........................................  Sent Otp Code End Here ...........................................//

  //Note :  Model Condition Check 1.this.data 2.this.checkLoginOrNot
}
