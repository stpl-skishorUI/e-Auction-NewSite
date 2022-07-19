import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsDialogsRoutingModule } from './components-dialogs-routing.module';
import { ComponentsDialogsComponent } from './components-dialogs.component';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';

@NgModule({
  declarations: [ComponentsDialogsComponent],
  imports: [
    CommonModule,
    ComponentsDialogsRoutingModule,
    PageLayoutModule,
    SecondaryToolbarModule,
    BreadcrumbsModule
  ]
})
export class ComponentsDialogsModule {
}
