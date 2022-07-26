import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApproveEventRoutingModule } from './approve-event-routing.module';
import { ApproveEventComponent } from './approve-event.component';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';

@NgModule({
  declarations: [
    ApproveEventComponent
  ],
  imports: [
    CommonModule,
    ApproveEventRoutingModule,
    AngularMaterialModule
  ]
})
export class ApproveEventModule { }
