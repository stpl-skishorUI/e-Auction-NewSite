import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { AddUserComponent } from '../admin/master/user-registration/add-user/add-user.component';

@Component({
  selector: 'vex-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  layoutCtrl = new UntypedFormControl('boxed');

  profileData: any;
  localstorageData :any =this.localstorageService.getLoggedInLocalstorageData()
  constructor(
    private commonService: CommonService,
    public apiService: ApiService,
    public errorSerivce: ErrorsService,
    public dialog: MatDialog,
    public localstorageService: LocalstorageService,
  ) { }

  ngOnInit(): void {
    this.getUserRegistration();
    this.localstorageData=this.localstorageData?.responseData;
  }

  getUserRegistration() {
    this.apiService.setHttp('get', "user-registration/" + this.localstorageService.userId(), false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res) => {
        if (res.statusCode === "200") {
          this.profileData = res.responseData;
        } else {
          this.profileData = [];
          this.commonService.checkDataType(res.statusMessage) == false ? this.errorSerivce.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
        }
      },
      error: ((error) => { this.errorSerivce.handelError(error.status) })
    });
  }

  openUserRegDialog(): void {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '1000px',
      data: this.profileData,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.statusCode == 200 && result?.formType == 'PUT') {
        this.getUserRegistration();
      }
    });
  }

}
