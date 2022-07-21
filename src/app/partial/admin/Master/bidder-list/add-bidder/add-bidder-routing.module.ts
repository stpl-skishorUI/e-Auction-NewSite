import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBidderComponent } from './add-bidder.component';

const routes: Routes = [{ path: '', component: AddBidderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddBidderRoutingModule { }
