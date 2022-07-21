import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HighestAuctionReportComponent } from './highest-auction-report.component';

const routes: Routes = [{ path: '', component: HighestAuctionReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HighestAuctionReportRoutingModule { }
