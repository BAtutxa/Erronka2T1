import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ZerbitzuaPageRoutingModule } from './zerbitzua-routing.module';

import { ZerbitzuaPage } from './zerbitzua.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZerbitzuaPageRoutingModule
  ],
  declarations: [ZerbitzuaPage]
})
export class ZerbitzuaPageModule {}
