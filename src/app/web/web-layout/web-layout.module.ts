import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebLayoutRoutingModule } from './web-layout-routing.module';
import { WebLayoutComponent } from './web-layout.component';
import { WHeaderComponent } from './w-header/w-header.component';
import { WFooterComponent } from './w-footer/w-footer.component';


@NgModule({
  declarations: [
    WebLayoutComponent,
    WHeaderComponent,
    WFooterComponent
  ],
  imports: [
    CommonModule,
    WebLayoutRoutingModule
  ]
})
export class WebLayoutModule { }
