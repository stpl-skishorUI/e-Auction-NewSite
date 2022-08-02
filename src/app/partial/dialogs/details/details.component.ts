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
  }
}
