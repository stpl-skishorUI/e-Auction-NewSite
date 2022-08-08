import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApproveEventRoutingModule } from './approve-event-routing.module';
import { ApproveEventComponent } from './approve-event.component';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';

import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    ApproveEventComponent
  ],
  imports: [
    CommonModule,
    ApproveEventRoutingModule,
    AngularMaterialModule,
    SecondaryToolbarModule,
    PageLayoutModule,
    BreadcrumbsModule,
    ReactiveFormsModule
  ]
})
export class ApproveEventModule { }
