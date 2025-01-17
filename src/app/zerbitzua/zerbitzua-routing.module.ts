import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZerbitzuaPage } from './zerbitzua.page';

const routes: Routes = [
  {
    path: '',
    component: ZerbitzuaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZerbitzuaPageRoutingModule {}
