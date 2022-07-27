import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublishEventRoutingModule } from './publish-event-routing.module';
import { PublishEventComponent } from './publish-event.component';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
@NgModule({
  declarations: [
    PublishEventComponent
  ],
  imports: [
    CommonModule,
    PublishEventRoutingModule,
    AngularMaterialModule,
    SecondaryToolbarModule,
    PageLayoutModule,
    BreadcrumbsModule,
    ReactiveFormsModule

  ]
})
export class PublishEventModule { }
