import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgreementRoutingModule } from './agreement-routing.module';
import { AgreementComponent } from './agreement.component';


@NgModule({
  declarations: [
    AgreementComponent
  ],
  imports: [
    CommonModule,
    AgreementRoutingModule
  ]
})
export class AgreementModule { }
