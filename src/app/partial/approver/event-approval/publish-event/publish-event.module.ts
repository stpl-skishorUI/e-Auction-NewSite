import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublishEventRoutingModule } from './publish-event-routing.module';
import { PublishEventComponent } from './publish-event.component';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';

@NgModule({
  declarations: [
    PublishEventComponent
  ],
  imports: [
    CommonModule,
    PublishEventRoutingModule,
    AngularMaterialModule,

  ]
})
export class PublishEventModule { }
