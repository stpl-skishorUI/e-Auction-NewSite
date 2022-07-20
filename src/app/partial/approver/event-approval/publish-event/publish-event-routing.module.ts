import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublishEventComponent } from './publish-event.component';

const routes: Routes = [{ path: '', component: PublishEventComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublishEventRoutingModule { }
