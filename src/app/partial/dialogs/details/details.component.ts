import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { PopoverRef } from 'src/@vex/components/popover/popover-ref';

@Component({
  selector: 'vex-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  dialogData = [];
  html: string = '';
  constructor(public dialogRef: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }



  ngOnInit(): void {
    this.dialogData = this?.data;
    if (this.dialogData?.length > 0) {
      for (let i = 0; i < this.dialogData?.length; i++) {
        this.html += this.dialogData[i]?.tag.split(' ')[0] + '<strong>' + this.dialogData[i]?.key + '</strong> :' + this.dialogData[i]?.val + this.dialogData[i]?.tag.split(' ')[1]
      }
    }
  }

  close(): void {
    /** Wait for animation to complete and then close */
    // setTimeout(() => this.popoverRef.close(), 50);
  }
}
