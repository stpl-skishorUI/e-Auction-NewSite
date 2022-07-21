import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BidHistoryComponent } from './bid-history.component';

const routes: Routes = [{ path: '', component: BidHistoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BidHistoryRoutingModule { }
