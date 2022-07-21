import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentsMasterRoutingModule } from './documents-master-routing.module';
import { DocumentsMasterComponent } from './documents-master.component';


@NgModule({
  declarations: [
    DocumentsMasterComponent
  ],
  imports: [
    CommonModule,
    DocumentsMasterRoutingModule
  ]
})
export class DocumentsMasterModule { }
