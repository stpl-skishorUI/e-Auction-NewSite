import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class VersionDetectedService {

  constructor(private swUpdate: SwUpdate, private snackBar: MatSnackBar) {
    if (swUpdate.isEnabled) {
    }
  }

  public checkForUpdate(): void {
    this.swUpdate.available.subscribe(() => this.promptUser());
  }

  private promptUser(): void {
    const snackBar = this.snackBar.open('An Update is Available', 'Reload', {
      // duration: 10000
    },
    )
    snackBar.onAction().subscribe(() => {
      this.swUpdate.activateUpdate()
        .then(() => window.location.reload())
    })
  }
}
