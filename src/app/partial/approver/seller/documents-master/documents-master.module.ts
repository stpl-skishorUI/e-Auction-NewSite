import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentsMasterRoutingModule } from './documents-master-routing.module';
import { DocumentsMasterComponent } from './documents-master.component';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';


@NgModule({
  declarations: [
    DocumentsMasterComponent
  ],
  imports: [
    CommonModule,
    DocumentsMasterRoutingModule,
    AngularMaterialModule,
    PageLayoutModule,
    BreadcrumbsModule,
    SecondaryToolbarModule
    
  ]
})
export class DocumentsMasterModule { }
