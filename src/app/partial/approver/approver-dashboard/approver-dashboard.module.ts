import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApproverDashboardRoutingModule } from './approver-dashboard-routing.module';
import { ApproverDashboardComponent } from './approver-dashboard.component';


@NgModule({
  declarations: [
    ApproverDashboardComponent
  ],
  imports: [
    CommonModule,
    ApproverDashboardRoutingModule
  ]
})
export class ApproverDashboardModule { }
