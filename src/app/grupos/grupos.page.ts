import { Component } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.page.html',
  styleUrls: ['./grupos.page.scss'],
})
export class GruposPage {
  groups = [
    { name: 'Grupo A', description: 'Descripción del Grupo A.' },
    { name: 'Grupo B', description: 'Descripción del Grupo B.' },
    { name: 'Grupo C', description: 'Descripción del Grupo C.' },
    { name: 'Grupo D', description: 'Descripción del Grupo D.' },
    { name: 'Grupo E', description: 'Descripción del Grupo E.' },
  ];

  selectedGroup: any = null;

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private alertController: AlertController
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(false);
  }

  showGroupDetails(group: any) {
    this.selectedGroup = group;
  }

  closeGroupDetails() {
    this.selectedGroup = null;
  }

  addGroup() {
    console.log('Agregar grupo: función no implementada');
    // Implementar lógica para agregar grupos en el futuro
  }

}
