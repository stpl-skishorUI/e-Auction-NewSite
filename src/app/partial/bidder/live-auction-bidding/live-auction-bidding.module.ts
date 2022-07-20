import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveAuctionBiddingRoutingModule } from './live-auction-bidding-routing.module';
import { LiveAuctionBiddingComponent } from './live-auction-bidding.component';


@NgModule({
  declarations: [
    LiveAuctionBiddingComponent
  ],
  imports: [
    CommonModule,
    LiveAuctionBiddingRoutingModule
  ]
})
export class LiveAuctionBiddingModule { }
