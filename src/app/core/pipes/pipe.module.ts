import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashPipe } from './dash.pipe';



@NgModule({
  declarations: [DashPipe],
  imports: [
    CommonModule
  ],
  exports: [
    DashPipe
  ]
})
export class PipeModule { }
