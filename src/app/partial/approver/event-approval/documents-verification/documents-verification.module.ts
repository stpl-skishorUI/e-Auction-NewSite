import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentsVerificationRoutingModule } from './documents-verification-routing.module';
import { DocumentsVerificationComponent } from './documents-verification.component';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';

import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DocumentsVerificationComponent
  ],
  imports: [
    CommonModule,
    DocumentsVerificationRoutingModule,
    AngularMaterialModule,
    SecondaryToolbarModule,
    PageLayoutModule,
    BreadcrumbsModule,
    ReactiveFormsModule

  ]
})
export class DocumentsVerificationModule { }
