import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BezeroPageRoutingModule } from './bezero-routing.module';

import { BezeroPage } from './bezero.page';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BezeroPageRoutingModule,
    SharedModule
],
  declarations: [BezeroPage]
})
export class BezeroPageModule {}
