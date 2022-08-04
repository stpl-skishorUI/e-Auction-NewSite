import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventDetailsRoutingModule } from './event-details-routing.module';
import { EventDetailsComponent } from './event-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';


@NgModule({
  declarations: [
    EventDetailsComponent
  ],
  imports: [
    CommonModule,
    EventDetailsRoutingModule,
    AngularMaterialModule,
    PageLayoutModule,
    SecondaryToolbarModule,
    BreadcrumbsModule,
    ReactiveFormsModule,
  ]
})
export class EventDetailsModule { }
