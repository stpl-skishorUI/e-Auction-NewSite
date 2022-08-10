import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/core/pipes/pipe.module';



@NgModule({
  declarations: [
    ProfileComponent,
   
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    AngularMaterialModule,
    SecondaryToolbarModule,
    PageLayoutModule,
    BreadcrumbsModule,
    ReactiveFormsModule,
    PipeModule
    
  ]
})
export class ProfileModule { }
