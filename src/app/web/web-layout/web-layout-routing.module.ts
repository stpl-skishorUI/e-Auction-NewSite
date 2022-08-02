import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('../../web/home/home.module').then(m => m.HomeModule), data: { breadcrumb: [{ title: 'Home', active: true }] } },
  // { path: 'login', loadChildren: () => import('../../web/login/login.module').then(m => m.LoginModule), data: { breadcrumb: [{ title: 'Login', active: true }] } },
  // { path: 'bidder-registration', loadChildren: () => import('../../web/bidder-registration/bidder-registration.module').then(m => m.BidderRegistrationModule), data: { breadcrumb: [{ title: 'Bidder Registration', active: true }] } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebLayoutRoutingModule { }
