import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LotsUploadComponent } from './lots-upload.component';

const routes: Routes = [{ path: '', component: LotsUploadComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LotsUploadRoutingModule { }
