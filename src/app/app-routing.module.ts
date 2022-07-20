import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { AuthorizationGuard } from './core/auth/authorization.guard';
import { ExpenseGuard } from './core/auth/expense.guard';
import { CustomLayoutComponent } from './custom-layout/custom-layout.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./web/auth/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./web/auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
  },
  { path: 'home', loadChildren: () => import('./web/home/home.module').then(m => m.HomeModule) },
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthorizationGuard],
    component: CustomLayoutComponent,
    children: [
      //----------------------------------------------------------------for admin routing start heare-----------------------------------------//
      { path: 'dashboard', loadChildren: () => import('./partial/admin/admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule), data: { breadcrumb: [{ title: 'Dashboard', active: true }] }, canActivate: [ExpenseGuard] },
      { path: 'user-registration', loadChildren: () => import('./partial/admin/Master/user-registration/user-registration.module').then(m => m.UserRegistrationModule), data: { breadcrumb: [{ title: 'Master', active: true }, { title: 'User Register', active: true }] }, canActivate: [ExpenseGuard] },
      { path: 'page-list', loadChildren: () => import('./partial/admin/Master/page-list/page-list.module').then(m => m.PageListModule), data: { breadcrumb: [{ title: 'Master', active: true }, { title: 'Page List', active: true }] }, canActivate: [ExpenseGuard] },
      { path: 'bidder-list', loadChildren: () => import('./partial/admin/Master/bidder-list/bidder-list.module').then(m => m.BidderListModule), data: { breadcrumb: [{ title: 'Master', active: true }, { title: 'Bidder Registration', active: true }] }, canActivate: [ExpenseGuard] },
      { path: 'user-right-access', loadChildren: () => import('./partial/admin/user-right-access/user-right-access.module').then(m => m.UserRightAccessModule), data: { breadcrumb: [{ title: 'User Right Access', active: true }] }, canActivate: [ExpenseGuard] },
      //----------------------------------------------------------------for admin routing end heare-----------------------------------------//

      //----------------------------------------------------------------for seller routing start heare-----------------------------------------//
      { path: 'seller-dashboard', loadChildren: () => import('./partial/seller/seller-dashboard/seller-dashboard.module').then(m => m.SellerDashboardModule) },
      { path: 'event-creation', loadChildren: () => import('./partial/seller/event-section/event-creation/event-creation.module').then(m => m.EventCreationModule) },
      { path: 'lots-upload/:id/:id/:id', loadChildren: () => import('./partial/seller/event-section/lots-upload/lots-upload.module').then(m => m.LotsUploadModule) },
      { path: 'event-list', loadChildren: () => import('./partial/seller/event-section/event-list/event-list.module').then(m => m.EventListModule) },

      //----------------------------------------------------------------for seller routing end heare-----------------------------------------//

      //----------------------------------------------------------------for approver routing start heare-----------------------------------------//
      { path: 'approver-dashboard', loadChildren: () => import('./partial/approver/approver-dashboard/approver-dashboard.module').then(m => m.ApproverDashboardModule) },
      { path: 'approve-event', loadChildren: () => import('./partial/approver/event-approval/approve-event/approve-event.module').then(m => m.ApproveEventModule) },
      { path: 'publish-event', loadChildren: () => import('./partial/approver/event-approval/publish-event/publish-event.module').then(m => m.PublishEventModule) },
      { path: 'documents-verification', loadChildren: () => import('./partial/approver/event-approval/documents-verification/documents-verification.module').then(m => m.DocumentsVerificationModule) },
      { path: 'live-auction', loadChildren: () => import('./partial/approver/event-approval/live-auction/live-auction.module').then(m => m.LiveAuctionModule) },
      { path: 'add-approval-level', loadChildren: () => import('./partial/approver/seller/add-approval-level/add-approval-level.module').then(m => m.AddApprovalLevelModule) },
      { path: 'agreement', loadChildren: () => import('./partial/approver/seller/agreement/agreement.module').then(m => m.AgreementModule) },
      { path: 'documents-master', loadChildren: () => import('./partial/approver/seller/documents-master/documents-master.module').then(m => m.DocumentsMasterModule) },
      { path: 'post-auction-links', loadChildren: () => import('./partial/approver/auction-reports/post-auction-links/post-auction-links.module').then(m => m.PostAuctionLinksModule) },
      { path: 'highest-auction-report', loadChildren: () => import('./partial/approver/auction-reports/highest-auction-report/highest-auction-report.module').then(m => m.HighestAuctionReportModule) },
      { path: 'bid-history', loadChildren: () => import('./partial/approver/auction-reports/bid-history/bid-history.module').then(m => m.BidHistoryModule) },
      { path: 'bidder-agreement-report', loadChildren: () => import('./partial/approver/auction-reports/bidder-agreement-report/bidder-agreement-report.module').then(m => m.BidderAgreementReportModule) },

      //----------------------------------------------------------------for approver routing end heare-----------------------------------------//
    ]
  },





  {
    path: '**',
    loadChildren: () => import('./web/errors/error-404/error-404.module').then(m => m.Error404Module)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'corrected',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
