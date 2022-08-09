import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { AuthorizationGuard } from './core/auth/authorization.guard';
import { ExpenseGuard } from './core/auth/expense.guard';
import { CustomLayoutComponent } from './custom-layout/custom-layout.component';
import { WebLayoutComponent } from './web/web-layout/web-layout.component';


const routes: Routes = [
  {path:'', redirectTo:'home', pathMatch:'full'},
  // { path: 'home', loadChildren: () => import('./web/home/home.module').then(m => m.HomeModule) },
  
  { path: '', component: WebLayoutComponent, loadChildren: () => import('./web/web-layout/web-layout.module').then(m => m.WebLayoutModule) },
  {
    path: 'login',
    loadChildren: () => import('./web/auth/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./web/auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
  },

  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthorizationGuard],
    component: CustomLayoutComponent,
    children: [
      //----------------------------------------------------------------for admin routing start heare-----------------------------------------//
      { path: 'dashboard', loadChildren: () => import('./partial/admin/admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule), data: { breadcrumb: [{ title: 'Dashboard', active: true }] }, canActivate: [ExpenseGuard] },
      { path: 'user-registration', loadChildren: () => import('./partial/admin/master/user-registration/user-registration.module').then(m => m.UserRegistrationModule), data: { breadcrumb: [{ title: 'Master', active: true }, { title: 'User Register', active: true }] }, canActivate: [ExpenseGuard]},
      { path: 'page-list', loadChildren: () => import('./partial/admin/master/page-list/page-list.module').then(m => m.PageListModule), data: { breadcrumb: [{ title: 'Master', active: true }, { title: 'Page List', active: true }] }, canActivate: [ExpenseGuard]},
      { path: 'bidder-list', loadChildren: () => import('./partial/admin/master/bidder-list/bidder-list.module').then(m => m.BidderListModule), data: { breadcrumb: [{ title: 'Master', active: true }, { title: 'Bidder Registration', active: true }] }, canActivate: [ExpenseGuard]},
      { path: 'user-right-access', loadChildren: () => import('./partial/admin/user-right-access/user-right-access.module').then(m => m.UserRightAccessModule), data: { breadcrumb: [{ title: 'User Right Access', active: true }] }, canActivate: [ExpenseGuard]},
      //----------------------------------------------------------------for admin routing end heare-----------------------------------------//

      //----------------------------------------------------------------for seller routing start heare-----------------------------------------//
      { path: 'seller-dashboard', loadChildren: () => import('./partial/seller/seller-dashboard/seller-dashboard.module').then(m => m.SellerDashboardModule), data: { breadcrumb: [{ title: 'Dashboard', active: true }] }, canActivate: [ExpenseGuard]},
      { path: 'event-creation', loadChildren: () => import('./partial/seller/event-section/event-creation/event-creation.module').then(m => m.EventCreationModule), data: { breadcrumb: [{ title: 'Dashboard', active: true }] }, canActivate: [ExpenseGuard]},
      { path: 'lots-upload/:id/:id/:id', loadChildren: () => import('./partial/seller/event-section/lots-upload/lots-upload.module').then(m => m.LotsUploadModule), data: { breadcrumb: [{ title: 'Dashboard', active: true }] }, canActivate: [ExpenseGuard]},
      { path: 'event-list', loadChildren: () => import('./partial/seller/event-section/event-list/event-list.module').then(m => m.EventListModule) },
      { path: 'e-detail/:id', loadChildren: () => import('./partial/approver/event-approval/approve-event/approve-event.module').then(m => m.ApproveEventModule), data: { breadcrumb: [{ title: 'Dashboard', active: true }] }, canActivate: [ExpenseGuard]},
      //----------------------------------------------------------------for seller routing end heare-----------------------------------------//

      //----------------------------------------------------------------for approver routing start heare-----------------------------------------//
      { path: 'approver-dashboard', loadChildren: () => import('./partial/approver/approver-dashboard/approver-dashboard.module').then(m => m.ApproverDashboardModule), data: { breadcrumb: [{ title: 'Dashboard', active: true }] }, canActivate: [ExpenseGuard]},
      { path: 'approve-event/:id', loadChildren: () => import('./partial/approver/event-approval/approve-event/approve-event.module').then(m => m.ApproveEventModule), data: { breadcrumb: [{ title: 'Dashboard', active: true }] }, canActivate: [ExpenseGuard]},
      { path: 'publish-event', loadChildren: () => import('./partial/approver/event-approval/publish-event/publish-event.module').then(m => m.PublishEventModule), data: { breadcrumb: [{ title: 'Dashboard', active: true }] }, canActivate: [ExpenseGuard]},
      { path: 'documents-verification', loadChildren: () => import('./partial/approver/event-approval/documents-verification/documents-verification.module').then(m => m.DocumentsVerificationModule), data: { breadcrumb: [{ title: 'Dashboard', active: true }]}, canActivate: [ExpenseGuard]},
      { path: 'live-auction', loadChildren: () => import('./partial/approver/event-approval/live-auction/live-auction.module').then(m => m.LiveAuctionModule), data: { breadcrumb: [{ title: 'Dashboard', active: true }] }, canActivate: [ExpenseGuard]  },
      { path: 'add-approval-level', loadChildren: () => import('./partial/approver/seller/add-approval-level/add-approval-level.module').then(m => m.AddApprovalLevelModule), data: { breadcrumb: [{ title: 'Dashboard', active: true }] }, canActivate: [ExpenseGuard]},
      { path: 'agreement', loadChildren: () => import('./partial/approver/seller/agreement/agreement.module').then(m => m.AgreementModule) },
      { path: 'documents-master', loadChildren: () => import('./partial/approver/seller/documents-master/documents-master.module').then(m => m.DocumentsMasterModule), data: { breadcrumb: [{ title: 'Dashboard', active: true }] }, canActivate: [ExpenseGuard]  },
      { path: 'post-auction-links', loadChildren: () => import('./partial/approver/auction-reports/post-auction-links/post-auction-links.module').then(m => m.PostAuctionLinksModule), data: { breadcrumb: [{ title: 'Dashboard', active: true }] }, canActivate: [ExpenseGuard]  },
      { path: 'highest-auction-report', loadChildren: () => import('./partial/approver/auction-reports/highest-auction-report/highest-auction-report.module').then(m => m.HighestAuctionReportModule), data: { breadcrumb: [{ title: 'Dashboard', active: true }] }, canActivate: [ExpenseGuard]},
      { path: 'bid-history', loadChildren: () => import('./partial/approver/auction-reports/bid-history/bid-history.module').then(m => m.BidHistoryModule) },
      { path: 'bidder-agreement-report', loadChildren: () => import('./partial/approver/auction-reports/bidder-agreement-report/bidder-agreement-report.module').then(m => m.BidderAgreementReportModule), data: { breadcrumb: [{ title: 'Dashboard', active: true }] }, canActivate: [ExpenseGuard]},

      {
        path: 'online-item-details/:id', loadChildren: () => import('./partial/approver/event-approval/publish-event/online-item-details/online-item-details.module').then(m => m.OnlineItemDetailsModule),
        data: { breadcrumb: [{ title: 'Dashboard', active: true }] },
        canActivate: [ExpenseGuard]
      },

      {
        path: 'approve-document/:id', loadChildren: () => import('./partial/approver/event-approval/documents-verification/document-approve/document-approve.module').then(m => m.DocumentApproveModule),
        data: { breadcrumb: [{ title: 'Master', active: true }, { title: 'User Registration', active: true }] },
        canActivate: [ExpenseGuard]
      },
      //----------------------------------------------------------------for approver routing end heare-----------------------------------------//

      //----------------------------------------------------------------for bidder routing start heare-----------------------------------------//
     
     // { path: 'bidder-dashboard', loadChildren: () => import('./web/web-layout/web-layout.module').then(m => m.WebLayoutModule) },
      { path: 'bidder-dashboard', loadChildren: () => import('./web/home/home.module').then(m => m.HomeModule) },
      { path: 'event-details', loadChildren: () => import('./partial/bidder/event-details/event-details.module').then(m => m.EventDetailsModule), data: { breadcrumb: [{ title: 'Dashboard', active: true }] }, canActivate: [ExpenseGuard]},
      { path: 'live_auction_bidding', loadChildren: () => import('./partial/bidder/live-auction-bidding/live-auction-bidding.module').then(m => m.LiveAuctionBiddingModule), data: { breadcrumb: [{ title: 'Dashboard', active: true }] }, canActivate: [ExpenseGuard] },
      { path: 'account-details', loadChildren: () => import('./partial/bidder/account-details/account-details.module').then(m => m.AccountDetailsModule), data: { breadcrumb: [{ title: 'Dashboard', active: true }] }, canActivate: [ExpenseGuard] },
      { path: 'eauction-event/:id', loadChildren: () => import('./partial/bidder/eauction-event/eauction-event.module').then(m => m.EauctionEventModule), data: { breadcrumb: [{ title: 'EauctionEventModule', active: true }] }, canActivate: [ExpenseGuard] },
      { path: 'profile', loadChildren: () => import('./partial/profile/profile.module').then(m => m.ProfileModule) },
      //----------------------------------------------------------------for bidder routing end heare-----------------------------------------//
    ]
  },
  { path: 'add-bidder', loadChildren: () => import('./partial/admin/master/bidder-list/add-bidder/add-bidder.module').then(m => m.AddBidderModule) },
  { path: 'bidder-registration', loadChildren: () => import('./partial/admin/master/bidder-list/add-bidder/add-bidder.module').then(m => m.AddBidderModule), data: { breadcrumb: [{ title: 'Bidder Registration', active: true }] }},
  { path: 'web-layout', loadChildren: () => import('./web/web-layout/web-layout.module').then(m => m.WebLayoutModule) },
  { path: 'document-approve', loadChildren: () => import('./partial/approver/event-approval/documents-verification/document-approve/document-approve.module').then(m => m.DocumentApproveModule) },

 
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
