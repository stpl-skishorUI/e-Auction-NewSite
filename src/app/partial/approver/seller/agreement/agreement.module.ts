import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgreementRoutingModule } from './agreement-routing.module';
import { AgreementComponent } from './agreement.component';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';

@NgModule({
  declarations: [
    AgreementComponent
  ],
  imports: [
    CommonModule,
    AgreementRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    BreadcrumbsModule,
    PageLayoutModule,
    SecondaryToolbarModule,
  ]
})
export class AgreementModule { }
