import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverRef } from '../popover/popover-ref';

@Component({
  selector: 'vex-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {


  constructor(private readonly popoverRef: PopoverRef, private router: Router) { }

  ngOnInit(): void {
  }

  close(): void {
    /** Wait for animation to complete and then close */
    setTimeout(() => this.popoverRef.close(), 50);
  }

  signOut() {
    this.close();
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['../login']);
  }
}
