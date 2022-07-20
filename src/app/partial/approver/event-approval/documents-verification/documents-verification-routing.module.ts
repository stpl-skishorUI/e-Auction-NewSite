import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsVerificationComponent } from './documents-verification.component';

const routes: Routes = [{ path: '', component: DocumentsVerificationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsVerificationRoutingModule { }
