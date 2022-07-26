import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BidHistoryRoutingModule } from './bid-history-routing.module';
import { BidHistoryComponent } from './bid-history.component';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';

@NgModule({
  declarations: [
    BidHistoryComponent
  ],
  imports: [
    CommonModule,
    BidHistoryRoutingModule,
    AngularMaterialModule 

  ]
})
export class BidHistoryModule { }
