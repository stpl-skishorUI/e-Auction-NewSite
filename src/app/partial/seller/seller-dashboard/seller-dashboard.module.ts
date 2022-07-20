import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellerDashboardRoutingModule } from './seller-dashboard-routing.module';
import { SellerDashboardComponent } from './seller-dashboard.component';


@NgModule({
  declarations: [
    SellerDashboardComponent
  ],
  imports: [
    CommonModule,
    SellerDashboardRoutingModule
  ]
})
export class SellerDashboardModule { }
