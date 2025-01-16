import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LimpiezaPageRoutingModule } from './limpieza-routing.module';

import { LimpiezaPage } from './limpieza.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LimpiezaPageRoutingModule,
    SharedModule
  ],
  declarations: [LimpiezaPage]
})
export class LimpiezaPageModule {}
