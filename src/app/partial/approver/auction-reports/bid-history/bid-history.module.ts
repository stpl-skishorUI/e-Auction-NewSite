import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BidHistoryRoutingModule } from './bid-history-routing.module';
import { BidHistoryComponent } from './bid-history.component';


@NgModule({
  declarations: [
    BidHistoryComponent
  ],
  imports: [
    CommonModule,
    BidHistoryRoutingModule
  ]
})
export class BidHistoryModule { }
