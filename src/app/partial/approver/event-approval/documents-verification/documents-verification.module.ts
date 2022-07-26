import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentsVerificationRoutingModule } from './documents-verification-routing.module';
import { DocumentsVerificationComponent } from './documents-verification.component';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';


@NgModule({
  declarations: [
    DocumentsVerificationComponent
  ],
  imports: [
    CommonModule,
    DocumentsVerificationRoutingModule,
    AngularMaterialModule
  ]
})
export class DocumentsVerificationModule { }
