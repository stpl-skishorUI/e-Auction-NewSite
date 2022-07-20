import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'vex-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddUserComponent>) { }

  ngOnInit(): void {
  }

  close(answer: string) {
    this.dialogRef.close(answer);
  }

}
