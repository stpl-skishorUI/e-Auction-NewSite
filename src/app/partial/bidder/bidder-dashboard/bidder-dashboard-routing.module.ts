import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BidderDashboardComponent } from './bidder-dashboard.component';

const routes: Routes = [{ path: '', component: BidderDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BidderDashboardRoutingModule { }
