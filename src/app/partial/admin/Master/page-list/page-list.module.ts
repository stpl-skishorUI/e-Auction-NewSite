import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageListRoutingModule } from './page-list-routing.module';
import { PageListComponent } from './page-list.component';
import { AddPageComponent } from './add-page/add-page.component';


@NgModule({
  declarations: [
    PageListComponent,
    AddPageComponent
  ],
  imports: [
    CommonModule,
    PageListRoutingModule
  ]
})
export class PageListModule { }
