import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostAuctionLinksRoutingModule } from './post-auction-links-routing.module';
import { PostAuctionLinksComponent } from './post-auction-links.component';


@NgModule({
  declarations: [
    PostAuctionLinksComponent
  ],
  imports: [
    CommonModule,
    PostAuctionLinksRoutingModule
  ]
})
export class PostAuctionLinksModule { }
