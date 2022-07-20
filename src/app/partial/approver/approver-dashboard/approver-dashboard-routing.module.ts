import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApproverDashboardComponent } from './approver-dashboard.component';

const routes: Routes = [{ path: '', component: ApproverDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApproverDashboardRoutingModule { }
