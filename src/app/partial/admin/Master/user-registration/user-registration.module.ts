import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRegistrationRoutingModule } from './user-registration-routing.module';
import { UserRegistrationComponent } from './user-registration.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserRegistrationComponent,
    AddUserComponent
  ],
  imports: [
    CommonModule,
    UserRegistrationRoutingModule,
    AngularMaterialModule,
    PageLayoutModule,
    SecondaryToolbarModule,
    BreadcrumbsModule,
    ReactiveFormsModule
  ]
})
export class UserRegistrationModule { }
