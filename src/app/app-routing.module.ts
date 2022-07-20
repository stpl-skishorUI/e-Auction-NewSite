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
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthorizationGuard],
    component: CustomLayoutComponent,
    children: [
      //----------------------------------------------------------------for admin routing start heare-----------------------------------------//
      {
        path: 'dashboard', loadChildren: () => import('./partial/admin/admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule),
        data: { breadcrumb: [{ title: 'Dashboard', active: true }] },
        canActivate: [ExpenseGuard]
      },
      {
        path: 'user-registration', loadChildren: () => import('./partial/admin/Master/user-registration/user-registration.module').then(m => m.UserRegistrationModule),
        data: { breadcrumb: [{ title: 'Master', active: true }, { title: 'User Register', active: true }] },
        canActivate: [ExpenseGuard]
      },
      {
        path: 'page-list', loadChildren: () => import('./partial/admin/Master/page-list/page-list.module').then(m => m.PageListModule),
        data: { breadcrumb: [{ title: 'Master', active: true }, { title: 'Page List', active: true }] },
        canActivate: [ExpenseGuard]
      },
      {
        path: 'bidder-list', loadChildren: () => import('./partial/admin/Master/bidder-list/bidder-list.module').then(m => m.BidderListModule),
        data: { breadcrumb: [{ title: 'Master', active: true }, { title: 'Bidder Registration', active: true }] },
        canActivate: [ExpenseGuard]
      },
      {
        path: 'user-right-access', loadChildren: () => import('./partial/admin/user-right-access/user-right-access.module').then(m => m.UserRightAccessModule),
        data: { breadcrumb: [{ title: 'User Right Access', active: true }] },
        canActivate: [ExpenseGuard]
      },
      //----------------------------------------------------------------for admin routing end heare-----------------------------------------//
    ]
  },
  { path: 'home', loadChildren: () => import('./web/home/home.module').then(m => m.HomeModule) },





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
