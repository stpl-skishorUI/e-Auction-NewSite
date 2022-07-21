import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsMasterComponent } from './documents-master.component';

const routes: Routes = [{ path: '', component: DocumentsMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsMasterRoutingModule { }
