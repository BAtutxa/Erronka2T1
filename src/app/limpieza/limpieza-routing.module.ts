import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LimpiezaPage } from './limpieza.page';

const routes: Routes = [
  {
    path: '',
    component: LimpiezaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LimpiezaPageRoutingModule {}
