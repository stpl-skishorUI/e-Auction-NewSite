import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApproveEventComponent } from './approve-event.component';

const routes: Routes = [{ path: '', component: ApproveEventComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApproveEventRoutingModule { }
