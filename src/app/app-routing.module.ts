import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { AuthorizationGuard } from './core/auth/authorization.guard';
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
      { path: 'dashboard', loadChildren: () => import('./partial/admin/admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule) },
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
