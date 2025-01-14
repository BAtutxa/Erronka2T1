import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BezeroPage } from './bezero.page';

const routes: Routes = [
  {
    path: '',
    component: BezeroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BezeroPageRoutingModule {}
