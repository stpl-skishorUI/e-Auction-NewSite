import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LotsUploadRoutingModule } from './lots-upload-routing.module';
import { LotsUploadComponent } from './lots-upload.component';


@NgModule({
  declarations: [
    LotsUploadComponent
  ],
  imports: [
    CommonModule,
    LotsUploadRoutingModule
  ]
})
export class LotsUploadModule { }
