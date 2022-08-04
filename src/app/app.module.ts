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
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { DetailsComponent } from './partial/dialogs/details/details.component';
import { AuctionPlotProfileComponent } from './partial/bidder/auction-plot-profile/auction-plot-profile.component';


@NgModule({
  declarations: [AppComponent, ConfirmationDialogComponent, SuccessDialogComponent, DetailsComponent, AuctionPlotProfileComponent],
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
  providers: [{
    provide: MAT_DATE_LOCALE,
    useValue: 'en-GB',
  },DatePipe, TitleCasePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
