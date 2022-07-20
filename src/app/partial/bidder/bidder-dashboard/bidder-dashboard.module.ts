import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BidderDashboardRoutingModule } from './bidder-dashboard-routing.module';
import { BidderDashboardComponent } from './bidder-dashboard.component';


@NgModule({
  declarations: [
    BidderDashboardComponent
  ],
  imports: [
    CommonModule,
    BidderDashboardRoutingModule
  ]
})
export class BidderDashboardModule { }
