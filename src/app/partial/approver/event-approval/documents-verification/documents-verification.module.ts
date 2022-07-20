import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentsVerificationRoutingModule } from './documents-verification-routing.module';
import { DocumentsVerificationComponent } from './documents-verification.component';


@NgModule({
  declarations: [
    DocumentsVerificationComponent
  ],
  imports: [
    CommonModule,
    DocumentsVerificationRoutingModule
  ]
})
export class DocumentsVerificationModule { }
