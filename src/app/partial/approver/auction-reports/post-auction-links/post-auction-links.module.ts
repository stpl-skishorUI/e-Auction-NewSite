import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostAuctionLinksRoutingModule } from './post-auction-links-routing.module';
import { PostAuctionLinksComponent } from './post-auction-links.component';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';

@NgModule({
  declarations: [
    PostAuctionLinksComponent
  ],
  imports: [
    CommonModule,
    PostAuctionLinksRoutingModule,
    AngularMaterialModule
  ]
})
export class PostAuctionLinksModule { }
