import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from '../shared/menu/menu.component';
import { RouterModule } from '@angular/router'; 

@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,IonicModule, RouterModule
  ],
  exports:[MenuComponent]
})
export class SharedModule { }
