import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublishEventRoutingModule } from './publish-event-routing.module';
import { PublishEventComponent } from './publish-event.component';


@NgModule({
  declarations: [
    PublishEventComponent
  ],
  imports: [
    CommonModule,
    PublishEventRoutingModule
  ]
})
export class PublishEventModule { }
