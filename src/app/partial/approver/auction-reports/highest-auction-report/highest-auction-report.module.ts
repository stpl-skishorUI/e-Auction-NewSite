import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HighestAuctionReportRoutingModule } from './highest-auction-report-routing.module';
import { HighestAuctionReportComponent } from './highest-auction-report.component';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';

@NgModule({
  declarations: [
    HighestAuctionReportComponent
  ],
  imports: [
    CommonModule,
    HighestAuctionReportRoutingModule,
    AngularMaterialModule
  ]
})
export class HighestAuctionReportModule { }
