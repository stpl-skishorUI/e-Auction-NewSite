import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DetailsComponent } from 'src/app/partial/dialogs/details/details.component';


@Injectable({
  providedIn: 'root'
})
export class DialogService {
  detailsComponentModal: MatDialogRef<DetailsComponent> | undefined
  constructor(private dialog: MatDialog) { }

  detailsComponentDialog(data: any, title: string, modalSize:string) { // details dialog
    this.detailsComponentModal = this.dialog.open(DetailsComponent, {
      data: { data: data, title: title, modalSize: modalSize },
      width: modalSize,
    });
  }
}
