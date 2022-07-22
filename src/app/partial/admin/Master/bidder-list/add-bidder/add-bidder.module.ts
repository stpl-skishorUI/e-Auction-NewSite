import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddBidderRoutingModule } from './add-bidder-routing.module';
import { AddBidderComponent } from './add-bidder.component';
import { AngularMaterialModule } from 'src/app/core/angular-material/angular-material.module';
// import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetTableModule } from 'src/@vex/components/widgets/widget-table/widget-table.module';
@NgModule({
  declarations: [
    AddBidderComponent
  ],
  imports: [
    CommonModule,
    AddBidderRoutingModule,
    AngularMaterialModule,
     FormsModule, 
     WidgetTableModule,
    ReactiveFormsModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyAkNBALkBX7trFQFCrcHO2I85Re2MmzTo8',
    //   language: 'en',
    //   libraries: ['places', 'geometry'],
    // }),
    
  ]
})
export class AddBidderModule { }
