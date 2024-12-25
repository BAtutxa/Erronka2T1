import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InbentarioPageRoutingModule } from './inbentario-routing.module';

import { InbentarioPage } from './inbentario.page';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InbentarioPageRoutingModule,
    SharedModule
  ],
  declarations: [InbentarioPage]
})
export class InbentarioPageModule {}
