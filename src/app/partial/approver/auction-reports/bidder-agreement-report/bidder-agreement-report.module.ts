import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BidderAgreementReportRoutingModule } from './bidder-agreement-report-routing.module';
import { BidderAgreementReportComponent } from './bidder-agreement-report.component';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';

@NgModule({
  declarations: [
    BidderAgreementReportComponent
  ],
  imports: [
    CommonModule,
    BidderAgreementReportRoutingModule,
    AngularMaterialModule
  ]
})
export class BidderAgreementReportModule { }
