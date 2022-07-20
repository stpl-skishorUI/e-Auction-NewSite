import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BidderListComponent } from './bidder-list.component';

const routes: Routes = [{ path: '', component: BidderListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BidderListRoutingModule { }
