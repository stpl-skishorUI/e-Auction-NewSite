import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventCreationRoutingModule } from './event-creation-routing.module';
import { EventCreationComponent } from './event-creation.component';


@NgModule({
  declarations: [
    EventCreationComponent
  ],
  imports: [
    CommonModule,
    EventCreationRoutingModule
  ]
})
export class EventCreationModule { }
