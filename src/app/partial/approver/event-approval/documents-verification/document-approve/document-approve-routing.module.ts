import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentApproveComponent } from './document-approve.component';

const routes: Routes = [{ path: '', component: DocumentApproveComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentApproveRoutingModule { }
