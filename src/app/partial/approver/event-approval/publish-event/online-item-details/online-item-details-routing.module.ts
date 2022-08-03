import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnlineItemDetailsComponent } from './online-item-details.component';

const routes: Routes = [{ path: '', component: OnlineItemDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineItemDetailsRoutingModule { }
