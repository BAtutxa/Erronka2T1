import { Component } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { HitzorduakService } from '../services/hitzorduak.service';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.page.html',
  styleUrls: ['./grupos.page.scss'],
})
export class GruposPage {
  groups: any[] = [];
  selectedGroup: any = null;

  constructor(
    private menuCtrl: MenuController,
    private alertController: AlertController,
    private hitzorduakService: HitzorduakService
  ) {}

  ngOnInit() {
    this.loadGroups();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(false);
  }

  loadGroups() {
    this.hitzorduakService.getGroups().subscribe((data) => {
      this.groups = data;
    });
  }

  showGroupDetails(group: any) {
    this.selectedGroup = group;
    this.loadPersons(group.id); // Corregido a loadPersons
  }

  closeGroupDetails() {
    this.selectedGroup = null;
  }

  loadPersons(groupId: number) { // Corregido el nombre de la función
    this.hitzorduakService.getPersonsByGroup(groupId).subscribe((data) => {
      if (this.selectedGroup && this.selectedGroup.id === groupId) {
        this.selectedGroup.persons = data; // Corregido a persons
      }
    });
  }

  async addGroup() {
    const alert = await this.alertController.create({
      header: 'Nuevo Grupo',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Nombre del grupo' },
        { name: 'description', type: 'text', placeholder: 'Descripción' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            this.hitzorduakService.addGroup(data).subscribe(() => this.loadGroups());
          },
        },
      ],
    });
    await alert.present();
  }

  deleteGroup(groupId: number) {
    this.hitzorduakService.deleteGroup(groupId).subscribe(() => this.loadGroups());
  }

  async addPerson(groupId: number) { // Corregido el nombre de la función
    const alert = await this.alertController.create({
      header: 'Nueva Persona',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Nombre' },
        { name: 'surname', type: 'text', placeholder: 'Apellidos' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            this.hitzorduakService.addPersonToGroup(groupId, data).subscribe(() => this.loadPersons(groupId));
          },
        },
      ],
    });
    await alert.present();
  }

  deletePerson(groupId: number, personId: number) { // Corregido a personId
    this.hitzorduakService.deletePersonFromGroup(groupId, personId).subscribe(() => {
      this.loadPersons(groupId);
    });
  }
}