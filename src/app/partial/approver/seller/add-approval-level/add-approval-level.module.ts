import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddApprovalLevelRoutingModule } from './add-approval-level-routing.module';
import { AddApprovalLevelComponent } from './add-approval-level.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';


@NgModule({
  declarations: [
    AddApprovalLevelComponent
  ],
  imports: [
    CommonModule,
    AddApprovalLevelRoutingModule,
    ReactiveFormsModule,
    BreadcrumbsModule,
    PageLayoutModule,
    SecondaryToolbarModule,
    AngularMaterialModule,
  ]
})
export class AddApprovalLevelModule { }
