import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DetailsComponent } from 'src/app/partial/dialogs/details/details.component';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  detailsComponentModal: MatDialogRef<DetailsComponent> | undefined
  constructor(private dialog: MatDialog, private apiService: ApiService) { }

  detailsComponentDialog(data: any) { // details dialog
    this.detailsComponentModal = this.dialog.open(DetailsComponent, {
      data: data,
      width: this.apiService.modalSize[2],
    });
  }
}
