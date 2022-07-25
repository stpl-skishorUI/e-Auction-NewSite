import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveAuctionRoutingModule } from './live-auction-routing.module';
import { LiveAuctionComponent } from './live-auction.component';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';


@NgModule({
  declarations: [
    LiveAuctionComponent
  ],
  imports: [
    CommonModule,
    LiveAuctionRoutingModule,
    AngularMaterialModule
  ]
})
export class LiveAuctionModule { }
