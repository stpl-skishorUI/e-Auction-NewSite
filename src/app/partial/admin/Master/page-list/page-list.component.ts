import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPageComponent } from './add-page/add-page.component';

@Component({
  selector: 'vex-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.scss']
})
export class PageListComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(): void {
    // @ts-ignore
    const dialogRef = this.dialog.open(AddPageComponent, {
      width: '400px',
      disableClose: true,
      data: '',
    });
  }

}
