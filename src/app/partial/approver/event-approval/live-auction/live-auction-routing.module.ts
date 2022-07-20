import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveAuctionComponent } from './live-auction.component';

const routes: Routes = [{ path: '', component: LiveAuctionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveAuctionRoutingModule { }
