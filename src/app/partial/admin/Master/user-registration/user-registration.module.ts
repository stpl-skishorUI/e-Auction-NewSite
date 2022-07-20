import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRegistrationRoutingModule } from './user-registration-routing.module';
import { UserRegistrationComponent } from './user-registration.component';
import { AddUserComponent } from './add-user/add-user.component';


@NgModule({
  declarations: [
    UserRegistrationComponent,
    AddUserComponent
  ],
  imports: [
    CommonModule,
    UserRegistrationRoutingModule
  ]
})
export class UserRegistrationModule { }
