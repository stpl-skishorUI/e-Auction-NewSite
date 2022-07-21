import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BidderAgreementReportRoutingModule } from './bidder-agreement-report-routing.module';
import { BidderAgreementReportComponent } from './bidder-agreement-report.component';


@NgModule({
  declarations: [
    BidderAgreementReportComponent
  ],
  imports: [
    CommonModule,
    BidderAgreementReportRoutingModule
  ]
})
export class BidderAgreementReportModule { }
