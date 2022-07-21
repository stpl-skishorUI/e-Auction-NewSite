import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostAuctionLinksComponent } from './post-auction-links.component';

const routes: Routes = [{ path: '', component: PostAuctionLinksComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostAuctionLinksRoutingModule { }
