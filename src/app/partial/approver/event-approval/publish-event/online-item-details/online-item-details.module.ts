import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnlineItemDetailsRoutingModule } from './online-item-details-routing.module';
import { OnlineItemDetailsComponent } from './online-item-details.component';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    OnlineItemDetailsComponent
  ],
  imports: [
    CommonModule,
    OnlineItemDetailsRoutingModule,
    AngularMaterialModule,
    SecondaryToolbarModule,
    PageLayoutModule,
    BreadcrumbsModule,
    ReactiveFormsModule
  ]
})
export class OnlineItemDetailsModule { }
