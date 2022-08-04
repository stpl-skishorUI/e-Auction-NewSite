import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
// import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';

import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';
import { MatNativeDateModule } from '@angular/material/core';
import { VexModule } from 'src/@vex/vex.module';
import { PipeModule } from 'src/app/core/pipes/pipe.module';
import { CustomLayoutModule } from 'src/app/custom-layout/custom-layout.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
// import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    PageLayoutModule,
    BreadcrumbsModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    FormsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    MatSelectModule,
    VexModule,
    PipeModule,
    SecondaryToolbarModule,
    CustomLayoutModule,MatNativeDateModule
  ], 
})
export class HomeModule { }
