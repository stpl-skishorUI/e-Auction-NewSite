import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidatorService } from 'src/app/core/services/validator.service';
import { UserRegistration } from '../user-registration.model';

@Component({
  selector: 'vex-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;
  userRegistrationForm!: FormGroup;

  subUserTypeArray = [];
  roleArray = [];
  userTypeArray = [];
  divisionArray = [];
  stateArray = [];
  districtArray = [];
  talukaArray = [];
  villageArray = [];
  designationArray = [];
  subDivisionArray = [];
  projectTypeArray=[];
  addUserFormFlag: boolean = false;

  userRegistration: UserRegistration[];
  initalValues: UserRegistration[];
  selectedFile: any;
  file: any;
  ImgUrl: any = 'assets/images/user.png';
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
    private error: ErrorsService,
    private apiService: ApiService,
    public commonService: CommonService,
    private localService: LocalstorageService,
    public validatorService: ValidatorService,
    public dialogRef: MatDialogRef<AddUserComponent>,
    public router: Router,
    public configService : ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.commonService.checkDataType(this.data) == false ? (this.addUserFormFlag = false, this.getDesignationArray()) : this.addUserFormFlag = true, this.initalValues = this.data;
    this.UserRegistration();
    this.getprojectType();
    this.commonService.checkDataType(this.data?.profilePath) == false && this.commonService.checkDataType(this.data) == true ? this.ImgUrl = 'assets/images/user.png' : this.ImgUrl = this.data?.profilePath;
   this.addUserFormFlag ==false? this.getstate():'';
  }

  /// ............... User Registration .............//


  UserRegistration() {
    this.userRegistrationForm = this.fb.group({
      projectId: [this.data?.projectId || '', [Validators.required]],
      roleId: ['', [Validators.required]],
      userTypeId: ['', [Validators.required]],
      subUserTypeId: ['', [Validators.required]],
      stateId: ['1', Validators.required],
      divisionId: [''],
      districtId: [''],
      talukaId: [''],
      name: [this.data?.name || '', [Validators.required,Validators.pattern(this.validatorService.valName)]],
      mobileNo: [this.data?.mobileNo || '', [Validators.required, Validators.pattern(this.validatorService.valMobileNo), Validators.minLength(10)]],
      userName: [this.data?.userName || '', [Validators.required,Validators.minLength(5),Validators.pattern(this.validatorService.valUserName)]],
      designationId: ['', [Validators.required]],
      emailId: [this.data?.emailId || '', [Validators.pattern(this.validatorService.valEmailId)]],
      userAddress: [this.data?.userAddress || '', [Validators.required]],
      subDivisionId: [this.data?.subDivisionId || ''],
      profilePath: ['']
    })
  }

  addUserData() {
    if (this.userRegistrationForm.invalid) {
      return
    }
    this.file ? this.fileUploaded() : this.addUserRegistration();
  }

  addUserRegistration() {
    let formData = this.userRegistrationForm?.value;
    let designationInfo = formData?.designationId;
    formData['createdBy'] = this.localService.userId();
    formData['modifiedBy'] = this.localService.userId();
    formData['designationId'] = designationInfo?.id;
    formData['designation'] = designationInfo?.designation;
    formData['createdDate'] = new Date();
    formData['modifiedDate'] = new Date();
    formData['isDeleted'] = false;
    formData['password'] = "";
    formData['bidderId'] = formData.bidderId ? formData.bidderId : 0;
    formData['sellerId'] = formData.sellerId ? formData.sellerId : 0;
    formData['approverId'] = formData.approverId ? formData.approverId : 0;
    formData['villageId'] = 0;
    formData['encryptionKey'] = '';
    formData['id'] = this.data ? this.data.id : 0;
    formData['profilePath'] = this.commonService.checkDataType(formData.profilePath) == false ? '' : formData.profilePath;
    formData['stateId'] = this.commonService.checkDataType(formData.stateId) == false ? 0 : formData.stateId;
    formData['talukaId'] = this.commonService.checkDataType(formData.talukaId) == false ? 0 : formData.talukaId;
    formData['subDivisionId'] = this.commonService.checkDataType(formData.subDivisionId) == false ? 0 : formData.subDivisionId;
    formData['divisionId'] = this.commonService.checkDataType(formData.divisionId) == false ? 0 : formData.divisionId;
    formData['districtId'] = this.commonService.checkDataType(formData.districtId) == false ? 0 : formData.districtId;

    let formType = this.data ? 'PUT' : 'POST';
    this.apiService.setHttp(formType, "user-registration", false, JSON.stringify(formData), false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: object) => {
        if (res['statusCode'] == "200") {
          formType == 'PUT' ? this.commonService.snackBar(res['statusMessage'], 0) : '';
          let obj = {
            formType: formType,
            statusCode: res['statusCode']
          }
          this.onNoClick(obj)
          this.clearForm();

        } else {
          if (res['statusCode'] != "404") {
            this.commonService.checkDataType(res['statusMessage']) == false ? this.error.handelError(res['statusCode']) : this.commonService.snackBar(res['statusMessage'], 1);
          }
        }
      },
      error: (error => { this.error.handelError(error.status) })
    });
  }

  clearForm() {
    this.formGroupDirective.resetForm();
    this.addUserFormFlag = false;
    this.getprojectType();
    this.userRegistrationForm.controls['stateId'].setValue(1);
  }

  clearDropdown(flag: string, _formName?: any) {
    this.addUserFormFlag = false;
    switch (flag) {
      case 'userTypeId':
        this.userRegistrationForm.controls['userTypeId'].setValue('');
        this.userRegistrationForm.controls['subUserTypeId'].setValue('');
        this.userRegistrationForm.controls['roleId'].setValue('');
        break;
      case 'subUserTypeId':
        this.userRegistrationForm.controls['subUserTypeId'].setValue('');
        this.userRegistrationForm.controls['roleId'].setValue('');
        break;
      case 'roleId':
        this.userRegistrationForm.controls['divisionId'].setValue('');
        this.userRegistrationForm.controls['districtId'].setValue('');
        this.userRegistrationForm.controls['talukaId'].setValue('');
        this.userRegistrationForm.controls['subDivisionId'].setValue('');
        break;
      case 'stateId':
        break;
      case 'divisionId':
        this.userRegistrationForm.controls['districtId'].setValue('');
        this.userRegistrationForm.controls['talukaId'].setValue('');
        break;
      case 'districtId':
        this.userRegistrationForm.controls['talukaId'].setValue('');
        break;
    }
  }

  getprojectType() {
    this.masterService.getProjectId().subscribe({
      next: (response: []) => {
        this.projectTypeArray = response;
        this.addUserFormFlag == true ? (this.userRegistrationForm.controls['projectId'].setValue(this.data?.projectId), this.getUserType()) : this.projectTypeArray.length == 1 ? (this.userRegistrationForm.controls['projectId'].setValue(this.projectTypeArray[0].id), this.getUserType()) : '';
      },
      error: (err => { this.error.handelError(err) })
    })
  }

  getRole() {
    this.roleArray = [];
    let fromData = this.userRegistrationForm.value;
    this.masterService.getUserRole(fromData.userTypeId, fromData.projectId).subscribe({
      next: (response: []) => {
        this.roleArray.push({ 'roleId': 0, 'roleType': 'Select Role' }, ...response);
        this.addUserFormFlag == true ? (this.userRegistrationForm.controls['roleId'].setValue(this.data?.roleId), this.getstate()) : '';
      },
      error: (err => { this.error.handelError(err) })
    })
  }



  //..... user type ....../
  getUserType() {
    this.userTypeArray = [];
    this.masterService.getUserType().subscribe({
      next: (response: []) => {
        this.userTypeArray.push({ 'userTypeId': 0, 'userType': 'Select User Type' }, ...response);
        this.userTypeArray =  this.commonService.removeObjFromArray(this.userTypeArray, 'userTypeId', 2);

        this.addUserFormFlag == true ? (this.userRegistrationForm.controls['userTypeId'].setValue(this.data?.userTypeId), this.getSubuserType(this.data?.userTypeId, this.data?.projectId)) : '';
      },
      error: (err => { this.error.handelError(err) })
    })
  }

  //..... user type ....../
  getSubuserType(userTypeId: number, projId:number) {
    this.subUserTypeArray = [];
    this.masterService.getSubuserType(userTypeId, projId).subscribe({
      next: (response: []) => {
        this.subUserTypeArray.push({ 'subUserTypeId': 0, 'subUserType': 'Select Sub User Type' }, ...response);
        this.addUserFormFlag == true ? (this.userRegistrationForm.controls['subUserTypeId'].setValue(this.data?.subUserTypeId), this.getRole()) : '';
      },
      error: (err => { this.error.handelError(err) })
    })
  }

  get f() { return this.userRegistrationForm.controls }


  //........ get state Array .....//
  getstate() {
    this.stateArray = [];
    this.masterService.getState().subscribe({
      next: (response: []) => {
        this.stateArray.push(...response);
        this.addUserFormFlag == true && this.data.subUserTypeId != 4 ? (this.userRegistrationForm.controls['stateId'].setValue(this.data?.stateId), this.getDivision(this.data.stateId)) : (this.userRegistrationForm.controls['stateId'].setValue(1),this.getDivision(1) );
        this.addUserFormFlag == true && this.data.subUserTypeId == 4 ? (this.userRegistrationForm.controls['stateId'].setValue(this.data?.stateId)) :(this.userRegistrationForm.controls['stateId'].setValue(1));
        this.addUserFormFlag == true ? this.getDesignationArray() : '';
      },
      error: (err => { this.error.handelError(err) })
    })
  }

  //........ Division Array ......//
  getDivision(stateId: number) {
    this.divisionArray = [];
    this.masterService.getDivisionByStateId(stateId || 0).subscribe({
      next: (response: []) => {
        this.divisionArray.push({ id: 0, division: "Select Division" }, ...response);
        this.addUserFormFlag == true && this.data.subUserTypeId != 4 ? (this.userRegistrationForm.controls['divisionId'].setValue(this.data?.divisionId), this.getDistrict(this.data.divisionId)) : ''
      },
      error: (err => { this.error.handelError(err) })
    })
  }

  //....... get distrcit  array ..... //
  getDistrict(divId: number) {
    this.districtArray = [];
    this.masterService.getDistrictByDivisionId(divId || 0).subscribe({
      next: (response: []) => {
        this.districtArray.push({ district: "Select District", id: 0 }, ...response);
        this.addUserFormFlag == true && this.data.subUserTypeId != 4 ? (this.userRegistrationForm.controls['districtId'].setValue(this.data?.districtId)) : ''
        this.data?.subUserTypeId == 7 ? this.getTaluka(this.data?.districtId) : '';
        this.data?.subUserTypeId == 6 &&  this.addUserFormFlag == true ? this.getSubDivision() : '';
      },
      error: (err => { this.error.handelError(err) })
    })
  }

  //......... get taluka Array ......//

  getTaluka(districtId: number) {
    this.talukaArray = [];
    this.masterService.getTaluka(districtId || 0).subscribe({
      next: (response: []) => {
        this.talukaArray.push({ id: 0, taluka: "Select Taluka" }, ...response);
        this.addUserFormFlag == true && this.data.subUserTypeId == 7 ? (this.userRegistrationForm.controls['talukaId'].setValue(this.data?.talukaId)) : ''
      },
      error: (err => { this.error.handelError(err) })
    })
  }


  getDesignationArray() {
    this.designationArray = [];
    this.masterService.getDesignation().subscribe({
      next: (response: []) => {
        this.designationArray.push({ id: 0, designation: "Select Designation", isDeleted: false }, ...response);
        if (this.addUserFormFlag == true) {
          let obj = {
            id: this.data.designationId,
            designation: this.data.designation
          }
          this.userRegistrationForm.controls['designationId'].setValue(obj);
        }
      },
      error: (err => { this.error.handelError(err) })
    })
  }

  getSubDivision() {
    this.subDivisionArray = [];
    let districtId = this.userRegistrationForm.value.districtId;
    this.masterService.getSubdivision(districtId).subscribe({
      next: (response: []) => {
        // this.subDivisionArray = response;
        this.subDivisionArray.push({ subDivision: "Select SDO", id: 0 }, ...response);
        this.addUserFormFlag == true ? this.userRegistrationForm.controls['subDivisionId'].setValue(this.data.subDivisionId) : '';
      },
      error: (err => { this.error.handelError(err) })
    })
  }

  onNoClick(status?: object): void {
    this.dialogRef.close(status);
  }

  addValSelSubUserType() {
    let getsubUserTypeValue = this.userRegistrationForm.value?.subUserTypeId;
    this.userRegistrationForm.get('divisionId')?.setValidators([]);
    this.userRegistrationForm.controls["divisionId"].updateValueAndValidity();
    this.userRegistrationForm.get('districtId')?.setValidators([]);
    this.userRegistrationForm.controls["districtId"].updateValueAndValidity();
    switch (getsubUserTypeValue) {
      case 4:
        this.userRegistrationForm.get('divisionId')?.setValidators([]);
        this.userRegistrationForm.controls["divisionId"].updateValueAndValidity();
        this.userRegistrationForm.get('districtId')?.setValidators([]);
        this.userRegistrationForm.controls["districtId"].updateValueAndValidity();
        this.userRegistrationForm.get('talukaId')?.setValidators([]);
        this.userRegistrationForm.controls["talukaId"].updateValueAndValidity();
        this.userRegistrationForm.get('subDivisionId')?.setValidators([]);
        this.userRegistrationForm.controls["subDivisionId"].updateValueAndValidity();
        break;
      case 5:
        this.userRegistrationForm.get('districtId')?.setValidators([Validators.required]);
        this.userRegistrationForm.controls["districtId"].updateValueAndValidity();
        this.userRegistrationForm.get('divisionId')?.setValidators([Validators.required]);
        this.userRegistrationForm.controls["divisionId"].updateValueAndValidity();
        this.userRegistrationForm.get('talukaId')?.setValidators([]);
        this.userRegistrationForm.controls["talukaId"].updateValueAndValidity();
        this.userRegistrationForm.get('subDivisionId')?.setValidators([]);
        this.userRegistrationForm.controls["subDivisionId"].updateValueAndValidity();
        break;
      case 6:
        this.userRegistrationForm.get('divisionId')?.setValidators([Validators.required]);
        this.userRegistrationForm.controls["divisionId"].updateValueAndValidity();
        this.userRegistrationForm.get('districtId')?.setValidators([Validators.required]);
        this.userRegistrationForm.controls["districtId"].updateValueAndValidity();
        this.userRegistrationForm.get('subDivisionId')?.setValidators([Validators.required]);
        this.userRegistrationForm.controls["subDivisionId"].updateValueAndValidity();
        this.userRegistrationForm.get('talukaId')?.setValidators([]);
        this.userRegistrationForm.controls["talukaId"].updateValueAndValidity();
        break;
      case 7:
        this.userRegistrationForm.get('divisionId')?.setValidators([Validators.required]);
        this.userRegistrationForm.controls["divisionId"].updateValueAndValidity();
        this.userRegistrationForm.get('districtId')?.setValidators([Validators.required]);
        this.userRegistrationForm.controls["districtId"].updateValueAndValidity();
        this.userRegistrationForm.get('talukaId')?.setValidators([Validators.required]);
        this.userRegistrationForm.controls["talukaId"].updateValueAndValidity();
        this.userRegistrationForm.get('subDivisionId')?.setValidators([]);
        this.userRegistrationForm.controls["subDivisionId"].updateValueAndValidity();
        break;
      case 3:
        this.userRegistrationForm.get('divisionId')?.setValidators([Validators.required]);
        this.userRegistrationForm.controls["divisionId"].updateValueAndValidity();
        this.userRegistrationForm.get('districtId')?.setValidators([Validators.required]);
        this.userRegistrationForm.controls["districtId"].updateValueAndValidity();
        break;
    }
   


  }

  documentUpload(event: any) {
    this.file = event;
    let selResult: any = event.target.value.split('.');
    let getImgExt = selResult.pop();
    getImgExt.toLowerCase();
    if (getImgExt == "png" || getImgExt == "jpg" || getImgExt == "jpeg") {
      this.selectedFile = <File>event.target.files[0];
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.ImgUrl = event.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);
        this.ImgUrl = event.target.files[0].name;
      }
    }
    else {
      this.commonService.snackBar("Profile image allowed only jpg or png format", 1);
    }

  }
  close(answer: string) {
    this.dialogRef.close(answer);
  }
  
  fileUploaded() {
    // let documentUrl: any = this.uploadFilesService.uploadDocuments(this.file, "profile", "png,jpg,jpeg,pdf", 5, 5000);
    // documentUrl.subscribe((ele: any) => {
    //   if (ele.statusCode == '200') {
    //     this.userRegistrationForm.controls['profilePath'].setValue(ele.responseData);
    //     this.addUserRegistration();
    //   } else {
    //     this.commonService.snackBar('Profile img is not uploaded', 1)
    //     this.addUserRegistration();
    //   }

    // })
  }

  choosePhoto() {
    let clickPhoto: any = document.getElementById('my_file')
    clickPhoto.click();
  }

  removePhoto() {
    localStorage.setItem('imgUrl', '');
    this.file = "";
    this.ImgUrl = 'assets/images/user.png';
    this.fileInput.nativeElement.value = '';
  }
  
 



}
