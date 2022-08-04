import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EauctionEventRoutingModule } from './eauction-event-routing.module';
import { EauctionEventComponent } from './eauction-event.component';


@NgModule({
  declarations: [
    EauctionEventComponent
  ],
  imports: [
    CommonModule,
    EauctionEventRoutingModule
  ]
})
export class EauctionEventModule { }
