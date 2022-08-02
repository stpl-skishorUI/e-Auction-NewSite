import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventCreationRoutingModule } from './event-creation-routing.module';
import { EventCreationComponent } from './event-creation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';

@NgModule({
  declarations: [
    EventCreationComponent
  ],
  imports: [
    CommonModule,
    EventCreationRoutingModule,
    ReactiveFormsModule,
    BreadcrumbsModule,
    PageLayoutModule,
    SecondaryToolbarModule,
    AngularMaterialModule
  ]
})
export class EventCreationModule { }
