import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BidHistoryRoutingModule } from './bid-history-routing.module';
import { BidHistoryComponent } from './bid-history.component';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';

@NgModule({
  declarations: 
    [
      BidHistoryComponent
    ],
  imports: 
    [
      CommonModule,
      BidHistoryRoutingModule,
      AngularMaterialModule,
      ReactiveFormsModule,
      BreadcrumbsModule,
      PageLayoutModule,
      SecondaryToolbarModule
    ]
})
export class BidHistoryModule { }
