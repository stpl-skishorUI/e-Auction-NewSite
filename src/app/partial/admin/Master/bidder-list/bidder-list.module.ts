import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BidderListRoutingModule } from './bidder-list-routing.module';
import { BidderListComponent } from './bidder-list.component';


@NgModule({
  declarations: [
    BidderListComponent
  ],
  imports: [
    CommonModule,
    BidderListRoutingModule
  ]
})
export class BidderListModule { }
