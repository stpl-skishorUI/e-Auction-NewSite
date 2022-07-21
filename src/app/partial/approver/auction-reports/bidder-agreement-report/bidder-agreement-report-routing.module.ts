import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BidderAgreementReportComponent } from './bidder-agreement-report.component';

const routes: Routes = [{ path: '', component: BidderAgreementReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BidderAgreementReportRoutingModule { }
