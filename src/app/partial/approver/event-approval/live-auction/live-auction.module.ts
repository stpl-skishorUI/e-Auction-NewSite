import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveAuctionRoutingModule } from './live-auction-routing.module';
import { LiveAuctionComponent } from './live-auction.component';


@NgModule({
  declarations: [
    LiveAuctionComponent
  ],
  imports: [
    CommonModule,
    LiveAuctionRoutingModule
  ]
})
export class LiveAuctionModule { }
