import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountDetailsRoutingModule } from './account-details-routing.module';
import { AccountDetailsComponent } from './account-details.component';

import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';

@NgModule({
  declarations: [
    AccountDetailsComponent
  ],
  imports: [
    CommonModule,
    AccountDetailsRoutingModule,
    AngularMaterialModule,
    PageLayoutModule,
    BreadcrumbsModule,
    SecondaryToolbarModule
  ]
})
export class AccountDetailsModule { }
