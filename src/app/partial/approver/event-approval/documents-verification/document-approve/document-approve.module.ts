import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentApproveRoutingModule } from './document-approve-routing.module';
import { DocumentApproveComponent } from './document-approve.component';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/core/pipes/pipe.module';


@NgModule({
  declarations: [
    DocumentApproveComponent
  ],
  imports: [
    CommonModule,
    DocumentApproveRoutingModule,
    AngularMaterialModule,
    SecondaryToolbarModule,
    PageLayoutModule,
    BreadcrumbsModule,
    ReactiveFormsModule,
    PipeModule
  ]
})
export class DocumentApproveModule { }
