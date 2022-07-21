import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HighestAuctionReportRoutingModule } from './highest-auction-report-routing.module';
import { HighestAuctionReportComponent } from './highest-auction-report.component';


@NgModule({
  declarations: [
    HighestAuctionReportComponent
  ],
  imports: [
    CommonModule,
    HighestAuctionReportRoutingModule
  ]
})
export class HighestAuctionReportModule { }
