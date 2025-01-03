import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-inbentario',
  templateUrl: './inbentario.page.html',
  styleUrls: ['./inbentario.page.scss'],
})
export class InbentarioPage {

  constructor(private menuCtrl: MenuController) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(true); // Habilita el menú al entrar
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(false); // Deshabilita el menú al salir
  }


}
