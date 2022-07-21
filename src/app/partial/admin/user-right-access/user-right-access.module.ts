import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRightAccessRoutingModule } from './user-right-access-routing.module';
import { UserRightAccessComponent } from './user-right-access.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';


@NgModule({
  declarations: [
    UserRightAccessComponent
  ],
  imports: [
    CommonModule,
    UserRightAccessRoutingModule,
    AngularMaterialModule,
    PageLayoutModule,
    SecondaryToolbarModule,
    BreadcrumbsModule,
    ReactiveFormsModule,
  ]
})
export class UserRightAccessModule { }
