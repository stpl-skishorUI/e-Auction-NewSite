import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HighestAuctionReportRoutingModule } from './highest-auction-report-routing.module';
import { HighestAuctionReportComponent } from './highest-auction-report.component';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
@NgModule({
  declarations: [
    HighestAuctionReportComponent
  ],
  imports: [
    CommonModule,
    HighestAuctionReportRoutingModule,
    AngularMaterialModule,
    SecondaryToolbarModule,
    BreadcrumbsModule,
    ReactiveFormsModule,
    PageLayoutModule
  ]
})
export class HighestAuctionReportModule { }
