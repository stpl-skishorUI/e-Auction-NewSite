import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BidderListRoutingModule } from './bidder-list-routing.module';
import { BidderListComponent } from './bidder-list.component';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';


@NgModule({
  declarations: [
    BidderListComponent
  ],
  imports: [
    CommonModule,
    BidderListRoutingModule,
    AngularMaterialModule,
    PageLayoutModule,
    SecondaryToolbarModule,
    BreadcrumbsModule,
    ReactiveFormsModule,
  ]
})
export class BidderListModule { }
