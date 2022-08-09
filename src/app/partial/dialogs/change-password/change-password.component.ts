import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { ValidatorService } from 'src/app/core/services/validator.service';

@Component({
  selector: 'vex-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePassForm!: FormGroup | any;
  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;
  userName: any;
  hide: boolean = true;
  oldPassword: boolean = true;
  newPassword: boolean = true;
  confirmPassword: boolean = true;
  localstorageData = this.localstorageService.getLoggedInLocalstorageData();

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private commonService: CommonService,
    private apiService: ApiService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    public localstorageService: LocalstorageService,
    public VB: ValidatorService,
    public configService: ConfigService,
    private errors: ErrorsService,
  ) { }

  ngOnInit(): void {
    this.defaultChangePassForm();
  }


  defaultChangePassForm() {
    this.changePassForm = this.fb.group({
      oldPassword: ['', Validators.compose([Validators.required])],
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*)(?=.*\W.*)[a-zA-Z0-9\S]{8,}$/)]],
      ConfirmPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*)(?=.*\W.*)[a-zA-Z0-9\S]{8,}$/)]],
    })
  }

  changePassword() {
    let formData = this.changePassForm.value;
    if (this.changePassForm.invalid) {
      return
    } else if (formData.newPassword != formData.ConfirmPassword) {
      this.changePasswordControl.ConfirmPassword.setErrors({ 'notMatched': true });
      return
    } else if ((formData.oldPassword == formData.newPassword) && (formData.oldPassword! = '' || formData.newPassword != '')) {
      this.changePasswordControl.ConfirmPassword.setErrors({ 'Matched': true });
      return;
    }

    if (this.changePassForm.status == "VALID") {
      this.spinner.show();
      let obj = 'OldPassword=' + formData.oldPassword + '&UserName=' + this.localstorageData.responseData.userName + '&Password=' + formData.newPassword + '&MobileNo=' + this.localstorageData.responseData?.mobileNo;
      this.apiService.setHttp('put', "user-registration/UpdatePassward?" + obj, false, false, false, 'masterUrl');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          this.spinner.hide();
          this.commonService.snackBar(res.statusMessage, 0);  
          this.onNoClick();             
        } else {
          this.spinner.hide();    
  
          this.commonService.checkDataType(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
        }
      }, (error: any) => {
        this.spinner.hide();
        this.errors.handelError(error.status);
      });
    }
  }


  get changePasswordControl() {
    return this.changePassForm.controls;
  }


  clear() {
    this.formGroupDirective.resetForm();
    this.oldPassword = true;
    this.newPassword = true;
    this.confirmPassword = true;
  }


  onNoClick(): void {
    this.dialogRef.close();
    this.logOut();    
  }

  logOut() {
    localStorage.clear();
  this.commonService.routerLinkRedirect('../login');
  }


  close(flag:string){
    this.dialogRef.close(flag);
      }

}
