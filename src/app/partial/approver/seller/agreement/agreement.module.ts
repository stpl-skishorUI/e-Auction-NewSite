import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgreementRoutingModule } from './agreement-routing.module';
import { AgreementComponent } from './agreement.component';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';

@NgModule({
  declarations: [
    AgreementComponent
  ],
  imports: [
    CommonModule,
    AgreementRoutingModule,
    AngularMaterialModule
  ]
})
export class AgreementModule { }
