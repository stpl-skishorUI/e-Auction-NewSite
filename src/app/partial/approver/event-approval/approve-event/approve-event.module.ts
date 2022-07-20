import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApproveEventRoutingModule } from './approve-event-routing.module';
import { ApproveEventComponent } from './approve-event.component';


@NgModule({
  declarations: [
    ApproveEventComponent
  ],
  imports: [
    CommonModule,
    ApproveEventRoutingModule
  ]
})
export class ApproveEventModule { }
