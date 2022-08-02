import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebLayoutRoutingModule } from './web-layout-routing.module';
import { WebLayoutComponent } from './web-layout.component';
import { WHeaderComponent } from './w-header/w-header.component';
import { WFooterComponent } from './w-footer/w-footer.component';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { CustomLayoutModule } from 'src/app/custom-layout/custom-layout.module';
import { VexModule } from 'src/@vex/vex.module';
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  declarations: [
    WebLayoutComponent,
    WHeaderComponent,
    WFooterComponent
  ],
  imports: [
    CommonModule,
    WebLayoutRoutingModule,
    CustomLayoutModule,MatNativeDateModule,
    MatRippleModule,
    VexModule,
    MatMenuModule
  ]
})
export class WebLayoutModule { }
