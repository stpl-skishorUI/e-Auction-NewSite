import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddBidderRoutingModule } from './add-bidder-routing.module';
import { AddBidderComponent } from './add-bidder.component';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';

@NgModule({
  declarations: [
    AddBidderComponent
  ],
  imports: [
    CommonModule,
    AddBidderRoutingModule,
    AngularMaterialModule
  ]
})
export class AddBidderModule { }
