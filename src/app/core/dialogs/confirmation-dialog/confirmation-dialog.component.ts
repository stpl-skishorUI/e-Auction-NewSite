import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'vex-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  dialogData: any;
  remark = new FormControl('');

  constructor(
    public commonService: CommonService,
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.dialogData = this.data;
  }

  close(flag: any): void {
    if (this.data.inputType && flag == "Yes") {
      if (this.remark.value == "") {
        this.commonService.snackBar("Please Enter Remark", 1);
        return
      } else {
        let obj = {
          flag: flag,
          inputValue: this.remark.value
        }
        this.dialogRef.close(obj)
      }
    } else {
      this.dialogRef.close(flag);
    }
  }


}
