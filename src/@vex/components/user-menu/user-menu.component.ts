import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopoverRef } from '../popover/popover-ref';

@Component({
  selector: 'vex-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  result: any;
  constructor(private readonly popoverRef: PopoverRef, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  close(): void {
    /** Wait for animation to complete and then close */
    setTimeout(() => this.popoverRef.close(), 250);
  }

  openDialog() {
    // this.dialog.open(ComponentsDialogsComponent, {
    //   disableClose: false,
    //   width: '400px'
    // }).afterClosed().subscribe(result => {
    //   this.result = result;
    // });
  }
}
