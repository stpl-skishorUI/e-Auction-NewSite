import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/core/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ApiService } from 'src/app/core/services/api.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { TranslateService } from 'src/app/core/services/translate.service';

@Component({
  selector: 'vex-w-header',
  templateUrl: './w-header.component.html',
  styleUrls: ['./w-header.component.scss']
})
export class WHeaderComponent implements OnInit {


  constructor(public translate: TranslateService, public localstorageService: LocalstorageService
    , public dialog: MatDialog, private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
  }
  
  logOut() {
    localStorage.clear();
    this.router.navigate(['../home']);
  }

  openLogOutDialog() {
    const dialog = this.dialog.open(ConfirmationDialogComponent, {
      width: this.apiService.modalSize[0], // p1 for paragraph 1 same as paragraph 2
      data: { p1: 'Do you really want to logout?', p2: '', cardTitle: 'Are you Sure?', successBtnText: 'Logout', dialogIcon: '', cancelBtnText: 'Cancel' },
    });

    dialog.afterClosed().subscribe((result: any) => {
      if (result == 'Yes') {
        this.logOut();
      }
    })
  }

}
