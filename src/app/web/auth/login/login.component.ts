import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { DatePipe } from '@angular/common';
import { ConfigService } from 'src/app/core/services/config.service';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { TranslateService } from 'src/app/core/services/translate.service';
import { ValidatorService } from 'src/app/core/services/validator.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms
  ]
})
export class LoginComponent implements OnInit {

  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;

  hide = true;
  newPassShow: boolean = true;
  confirmPassShow: boolean = true;
  loginForm!: FormGroup | any;
  genPasswordFlag: boolean = false;
  setPasswordForm!: FormGroup | any;
  setPasswordFlag: boolean = false;
  mobileNo: any = new FormControl('');
  otp: any = new FormControl('');
  setPasswodPage: boolean = false;
  otpFlag: boolean = false;

  get mobileNoControls() { return this.mobileNo.controls }
  get otpNoControls() { return this.otp.controls }

  // form: UntypedFormGroup;

  inputType = 'password';
  visible = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public VB: ValidatorService,
    public commonService: CommonService,
    private error: ErrorsService,
    public spinner: NgxSpinnerService,
    private router: Router,
    private localstorageService: LocalstorageService,
    private route: ActivatedRoute,
    public configService:ConfigService
    
    ) {}

              ngOnInit(): void {
                this.defaultLoginForm();
                this.getIPAddress();
              }
              ipAddress: any;
            
              getIPAddress() {
                this.apiService.setHttp('get', "https://api.ipify.org?format=json", false, false, false, false);
                this.apiService.getHttp().subscribe({
                  next: (res: any) => {
                    this.ipAddress = res.ip;
                  }
                })
              }
            
              ngAfterViewInit(): void {
                this.setPasswodPage == false ? this.commonService.createCaptchaCarrerPage() : '';
              }
            
              get loginFormControls() { return this.loginForm.controls }
            
              get changePasswordForm() { return this.setPasswordForm.controls }
            
              defaultLoginForm() {
                this.loginForm = this.fb.group({
                
                  UserName: ['', [Validators.required, Validators.pattern(this.VB.valUserName), Validators.minLength(5)]],
                  Password: ['', [Validators.required, Validators.pattern(this.VB.valPassword)]],
                  recaptchaReactive: ['', [Validators.required]],
                })
                this.setPasswordForm = this.fb.group({
                  UserName: ['', Validators.compose([Validators.required, Validators.pattern(this.VB.valUserName), Validators.minLength(5)])],
                  newPassword: ['', [Validators.required, Validators.pattern(this.VB.valPassword)]],
                  confirmPassword: ['', [Validators.required, Validators.pattern(this.VB.valPassword)]]
                });
            
              }
            
              loginFormSubmit() {
                const formValue = this.loginForm.value;
                if (this.loginForm.invalid) {
                  return;
                } else if (formValue.recaptchaReactive.trim() != this.commonService.checkvalidateCaptcha()) {
                  this.commonService.snackBar("Please enter valid captcha ", 1);
                  return;
                }
                this.apiService.setHttp('get', "user-registration/" + formValue.UserName.trim() + "/" + formValue.Password.trim() + "?IpAddress=" + this.ipAddress, false, false, false, 'masterUrl');
                this.apiService.getHttp().subscribe({
                  next: (res: any) => {
                    if (res.statusCode === "200") {
                      if (res.responseData.isBlock == true) {
                        this.commonService.snackBar('User is blocked', 1);
                        return
                      }
                      this.getPageAccessByUserId(res);
                      //
                    } else {
                      this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
                    }
                  },
                  error: ((error: any) => { this.error.handelError(error.status) })
                })
              }
            
              getPageAccessByUserId(data: any) {
                this.apiService.setHttp('get', "user-type/GetbyUserTypeId?UserId=" + data.responseData.id + '&pagesize=' + this.apiService.pagesize, false, false, false, 'masterUrl');
                this.apiService.getHttp().subscribe({
                  next: (res: any) => {
                    if (res.statusCode === "200") {
                      if (this.commonService.checkDataType(res.responseData.responseData1) == false) {
                        this.commonService.snackBar('Soory you not have right to access page. Please contact admin.', 1);
                        return
                      } else {
                        data.responseData1 = { "pageUrls": res.responseData.responseData1 }
                        localStorage.setItem('user', JSON.stringify(data));
                        sessionStorage.setItem('loggedIn', 'true');
                        let urlPath = this.localstorageService.redirectToDashborad();
                        this.router.navigate(['../' + urlPath], { relativeTo: this.route })
                      }
                    } else {
                      this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
                    }
            
                  },
                  error: (error: any) => { this.error.handelError(error.status) }
                })
              }
            
              sentOtpMobile() {
                if (this.mobileNo.value.length != 10) {
                  this.commonService.snackBar('Please enter Valid Mobile Number', 1);
                  return
                }
                // else {
                //   this.genPasswordFlag = false;
                //   this.otpFlag = true;
                // }
                if (this.commonService.checkDataType(this.mobileNo.value) == true) {
                  let obj = {
                    "createdBy": 0,
                    "modifiedBy": 0,
                    "createdDate": new Date(),
                    "modifiedDate": new Date(),
                    "isDeleted": true,
                    "id": 0,
                    "mobileNo": this.mobileNo.value.toString(),
                    "otp": "",
                    "pageName": "login",
                    "otpExpireDate": new Date(),
                    "isUser": true
                  }
                  this.apiService.setHttp('POST', 'otp-tran', false, JSON.stringify(obj), false, 'masterUrl');
                  this.apiService.getHttp().subscribe((res: any) => {
                    if (res.statusCode == "200") {
                      this.commonService.snackBar(res.statusMessage, 0);
                      this.genPasswordFlag = false;
                      this.otpFlag = true;
                    } else {
                      this.commonService.snackBar(res.statusMessage, 1);
                    }
                  }, (error: any) => {
                    this.error.handelError(error.status);
                  });
                } else {
                  this.commonService.snackBar('Please Check Mobile Number..!!!', 0);
                }
              }
            
              otpSubmit() {
                if (this.otp.value.length != 5) {
                  this.commonService.snackBar('Please enter Valid OTP', 1);
                  return
                } else {
                  let obj = {
                    "createdBy": 0,
                    "modifiedBy": 0,
                    "createdDate": new Date(),
                    "modifiedDate": new Date(),
                    "isDeleted": true,
                    "id": 0,
                    "mobileNo": this.mobileNo.value.toString(),
                    "otp": this.otp.value.toString(),
                    "pageName": "login",
                    "otpExpireDate": new Date(),
                    "isUser": true
                  }
                  this.apiService.setHttp('POST', 'otp-tran/VerifyOTP', false, JSON.stringify(obj), false, 'masterUrl');
                  this.apiService.getHttp().subscribe((res: any) => {
                    if (res.statusCode == "200") {
                      this.otpFlag = false;
                      this.setPasswodPage = true;
                      // this.mobileNo.setValue('');
                      this.otp.setValue('');
                      this.commonService.snackBar(res.statusMessage, 0);
                      this.genPasswordFlag = false;
                      this.otpFlag = false;
                      this.setPasswodPage = true;
                    } else {
                      this.commonService.snackBar(res.statusMessage, 1);
                    }
                  }, (error: any) => {
                    this.error.handelError(error.status);
                  });
            
                }
              }
            
              setPasswordSubmit() {
                if (this.setPasswordForm.invalid) {
                  return;
                }
                else if (this.setPasswordForm.value['newPassword'] !== this.setPasswordForm.value['confirmPassword']) {
                  this.commonService.snackBar("Password and confirm password should match", 1);
                }
                else {
                  let obj = {
                    'OldPassword': '',
                    'UserName': this.setPasswordForm.value.UserName,
                    'Password': this.setPasswordForm.value.newPassword,
                    'MobileNo': this.mobileNo.value.toString(),
                  }
                  this.apiService.setHttp('PUT', 'user-registration/UpdatePassward?OldPassword=&UserName=' + obj.UserName + '&Password=' + obj.Password + '&MobileNo=' + obj.MobileNo, false, false, false, 'masterUrl');
                  this.apiService.getHttp().subscribe((res: any) => {
                    if (res.statusCode == "200") {
                      this.setPasswodPage = false;
                      this.commonService.snackBar(res.statusMessage, 0);
                      this.closeSetPassword();
                      this.otpFlag = false;
                    } else {
                      this.commonService.snackBar(res.statusMessage, 1);
                    }
                  }, (error: any) => {
                    this.error.handelError(error.status);
                  });
                }
              }
            
              clearSetPassword() {
                this.formGroupDirective.resetForm();
                // this.setPasswordForm.reset();
              }
            
              closeSetPassword() {
                this.setPasswodPage = false;
                setTimeout(() => {
                  this.commonService.createCaptchaCarrerPage();
                  this.formGroupDirective.resetForm();
                }, 100);
              }
}
