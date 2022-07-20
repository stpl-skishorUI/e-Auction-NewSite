import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddApprovalLevelRoutingModule } from './add-approval-level-routing.module';
import { AddApprovalLevelComponent } from './add-approval-level.component';


@NgModule({
  declarations: [
    AddApprovalLevelComponent
  ],
  imports: [
    CommonModule,
    AddApprovalLevelRoutingModule
  ]
})
export class AddApprovalLevelModule { }
