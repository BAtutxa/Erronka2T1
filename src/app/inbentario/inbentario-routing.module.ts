import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InbentarioPage } from './inbentario.page';

const routes: Routes = [
  {
    path: '',
    component: InbentarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InbentarioPageRoutingModule {}
