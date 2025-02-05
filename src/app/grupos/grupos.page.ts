import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { HitzorduakService } from '../services/hitzorduak.service';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.page.html',
  styleUrls: ['./grupos.page.scss'],
})
export class GruposPage implements OnInit {
  groups: any[] = [];
  langile: any[] = [];
  selectedGroup: any = null;
  isModalOpen: boolean = false;

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

  loadGroups(): void {
    this.hitzorduakService.getGroups().subscribe(
      (data) => {
        this.groups = data.map((groups) => ({
          id: groups.id,
          name: groups.izena,
        }));
      },
      (error) => {
        console.error('Error al cargar productos:', error);
      }
    );
  }
  showGroupDetails(group: any) {
    this.selectedGroup = group;
    this.loadPersons(group.id);
    this.isModalOpen = true; 
  }

  closeGroupDetails() {
    this.selectedGroup = null;
    this.isModalOpen = false;
  }

  loadPersons(groupId: number): void {
    this.hitzorduakService.getPersonsByGroup(groupId).subscribe(
      (data) => {
        if (this.selectedGroup.id && this.selectedGroup.id === groupId) {
          this.selectedGroup.persons = data.map((person) => ({
            id: person.kodea,
            name: person.izena,
            surname: person.abizenak
          }));
        }
      },
      (error) => {
        console.error('Error al cargar personas:', error);
      }
    );
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