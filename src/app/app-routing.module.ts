import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'citas',
    loadChildren: () => import('./citas/citas.module').then(m => m.CitasPageModule)
  },  {
    path: 'inbentario',
    loadChildren: () => import('./inbentario/inbentario.module').then( m => m.InbentarioPageModule)
  },
  {
    path: 'grupos',
    loadChildren: () => import('./grupos/grupos.module').then( m => m.GruposPageModule)
  },
  {
    path: 'ticket',
    loadChildren: () => import('./ticket/ticket.module').then( m => m.TicketPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
