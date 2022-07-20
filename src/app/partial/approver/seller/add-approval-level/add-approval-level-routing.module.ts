import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddApprovalLevelComponent } from './add-approval-level.component';

const routes: Routes = [{ path: '', component: AddApprovalLevelComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddApprovalLevelRoutingModule { }
