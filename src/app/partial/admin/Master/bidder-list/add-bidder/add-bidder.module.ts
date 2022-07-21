import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddBidderRoutingModule } from './add-bidder-routing.module';
import { AddBidderComponent } from './add-bidder.component';


@NgModule({
  declarations: [
    AddBidderComponent
  ],
  imports: [
    CommonModule,
    AddBidderRoutingModule
  ]
})
export class AddBidderModule { }
