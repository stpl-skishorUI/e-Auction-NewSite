import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EauctionEventComponent } from './eauction-event.component';

const routes: Routes = [{ path: '', component: EauctionEventComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EauctionEventRoutingModule { }
