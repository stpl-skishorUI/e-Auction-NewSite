import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
// import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';

@Component({
  selector: 'vex-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  userRegistrationForm: any;

  constructor(private dialogRef: MatDialogRef<AddUserComponent>,
    public masterService:MasterService,
    public commonService:CommonService,
    // private apiService:ApiService,
    private fb:FormBuilder,
    // private error:ErrorsService,
    // public validatorService: ValidatorService,
    @Inject(MAT_DIALOG_DATA) public data: any,

    ) { }

  ngOnInit(): void {
  this.UserRegistration();
  }
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
      // name: [this.data?.name || '', [Validators.required,Validators.pattern(this.validatorService.valName)]],
      // mobileNo: [this.data?.mobileNo || '', [Validators.required, Validators.pattern(this.validatorService.valMobileNo), Validators.minLength(10)]],
      // userName: [this.data?.userName || '', [Validators.required,Validators.minLength(5),Validators.pattern(this.validatorService.valUserName)]],
      designationId: ['', [Validators.required]],
      // emailId: [this.data?.emailId || '', [Validators.pattern(this.validatorService.valEmailId)]],
      userAddress: [this.data?.userAddress || '', [Validators.required]],
      subDivisionId: [this.data?.subDivisionId || ''],
      profilePath: ['']
    })
  }
  close(answer: string) {
    this.dialogRef.close(answer);
  }

}
