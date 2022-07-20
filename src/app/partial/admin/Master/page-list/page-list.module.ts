import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageListRoutingModule } from './page-list-routing.module';
import { PageListComponent } from './page-list.component';
import { AddPageComponent } from './add-page/add-page.component';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';


@NgModule({
  declarations: [
    PageListComponent,
    AddPageComponent
  ],
  imports: [
    CommonModule,
    PageListRoutingModule,
    PageLayoutModule,
    SecondaryToolbarModule,
    BreadcrumbsModule,
    AngularMaterialModule

  ]
})
export class PageListModule { }
