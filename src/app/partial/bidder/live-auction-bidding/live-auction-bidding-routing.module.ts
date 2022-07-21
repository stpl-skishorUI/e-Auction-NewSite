import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveAuctionBiddingComponent } from './live-auction-bidding.component';

const routes: Routes = [{ path: '', component: LiveAuctionBiddingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveAuctionBiddingRoutingModule { }
