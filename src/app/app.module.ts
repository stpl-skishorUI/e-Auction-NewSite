import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VexModule } from '../@vex/vex.module';
import { HttpClientModule } from '@angular/common/http';
import { CustomLayoutModule } from './custom-layout/custom-layout.module';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { AngularMaterialModule } from './core/angular-material/angular-material.module';
import { ConfirmationDialogComponent } from './core/dialogs/confirmation-dialog/confirmation-dialog.component';
import { SuccessDialogComponent } from './core/dialogs/success-dialog/success-dialog.component';
import { PipeModule } from './core/pipes/pipe.module';
import { MatNativeDateModule } from '@angular/material/core';
@NgModule({
  declarations: [AppComponent, ConfirmationDialogComponent, SuccessDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    // Vex
    VexModule,
    PipeModule,
    CustomLayoutModule,MatNativeDateModule
  ],
  providers: [DatePipe, TitleCasePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
