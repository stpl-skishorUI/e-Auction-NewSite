import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { ValidatorService } from 'src/app/core/services/validator.service';
// import { fadeInUp400ms } from '../../../../../@vex/animations/fade-in-up.animation';

@Component({
  selector: 'vex-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  // animations: [fadeInUp400ms]
})
export class ForgotPasswordComponent implements OnInit {

  mobileOtpForm:FormGroup | any;
  

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public commonService: CommonService,
    private error: ErrorsService,
    public configService:ConfigService,
    public validatorService: ValidatorService,
  ) { }

  ngOnInit() {
    this.defaultForm();
  }

  get f() { return this.mobileOtpForm.controls }

  defaultForm(){
   this.mobileOtpForm = this.fb.group({
      mobileNo: ['', [Validators.required, Validators.pattern(this.validatorService.valMobileNo), Validators.minLength(10)]],
    });
  }

  sentOtpMobile() {
    if (this.mobileOtpForm.invalid) {
      this.commonService.snackBar('Please enter Valid Mobile Number', 1);
      return
    }
    // else {
    //   this.genPasswordFlag = false;
    //   this.otpFlag = true;
    // }
    if (this.commonService.checkDataType(this.mobileOtpForm.mobileNo.value) == true) {
      let obj = {
        "createdBy": 0,
        "modifiedBy": 0,
        "createdDate": new Date(),
        "modifiedDate": new Date(),
        "isDeleted": true,
        "id": 0,
        "mobileNo": this.mobileOtpForm.mobileNo.value.toString(),
        "otp": "",
        "pageName": "login",
        "otpExpireDate": new Date(),
        "isUser": true
      }
      this.apiService.setHttp('POST', 'otp-tran', false, JSON.stringify(obj), false, 'masterUrl');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          this.commonService.snackBar(res.statusMessage, 0);
          // this.genPasswordFlag = false;
          // this.otpFlag = true;
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
}
