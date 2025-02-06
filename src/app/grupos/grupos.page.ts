import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { HitzorduakService } from '../services/hitzorduak.service';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.page.html',
  styleUrls: ['./grupos.page.scss'],
})
export class GruposPage implements OnInit {
  grupos: any[] = [];
  langileak: any[] = [];
  filteredItems: any[] = [];
  currentSection: 'grupos' | 'langileak' = 'grupos';
  selectedItem: any = null;
  isModalOpen: boolean = false;

  constructor(
    private menuCtrl: MenuController,
    private alertController: AlertController,
    private hitzorduakService: HitzorduakService
  ) {}

  ngOnInit(): void {
    this.loadData(); // Carga inicial de datos
  }

  loadData(): void {
    this.loadGrupos();
    this.loadLangileak();
  }

  loadGrupos(): void {
    this.hitzorduakService.getGroups().subscribe(
      (data) => {
        this.grupos = data.map((grupo) => ({
          id: grupo.kodea,
          name: grupo.izena,
          description: grupo.description || 'Sin descripción',
          type: 'grupos'
        }));
        if (this.currentSection === 'grupos') this.filterItems();
      },
      (error) => {
        console.error('Error al cargar grupos:', error);
      }
    );
  }

  loadLangileak(): void {
    this.hitzorduakService.getLangileak().subscribe({
      next: (data: any[]) => {
        this.langileak = data.map((langile) => ({
          id: langile.id,
          name: langile.izena,
          surname: langile.abizenak,
          type: 'langileak'
        }));
        if (this.currentSection === 'langileak') this.filterItems();
      },
      error: (error: any) => {
        console.error('Error al cargar langileak:', error);
      }
    });
  }
  segmentChanged(): void {
    this.filterItems();
  }

  filterItems(event?: any): void {
    const query = event?.target?.value?.toLowerCase() || '';
    const items = this.currentSection === 'grupos' ? this.grupos : this.langileak;
    this.filteredItems = items.filter((item) => item.name.toLowerCase().includes(query));
  }

  showItemDetails(item: any): void {
    this.selectedItem = item;
    this.isModalOpen = true;
  }

  closeItemDetails(): void {
    this.selectedItem = null;
    this.isModalOpen = false;
  }

  deleteItem(itemId: number, event: Event): void {
    event.stopPropagation();
    const confirm = this.alertController.create({
      header: 'Confirmar',
      message: '¿Seguro que quieres eliminar este ítem?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            if (this.currentSection === 'grupos') {
              this.hitzorduakService.deleteGroup(itemId).subscribe(() => {
                this.loadGrupos();
              });
            } else {
              this.hitzorduakService.deleteLangile(itemId).subscribe(() => {
                this.loadLangileak();
              });
            }
          },
        },
      ],
    });
    confirm.then((alert) => alert.present());
  }

  saveChanges(): void {
    if (this.currentSection === 'grupos') {
      this.hitzorduakService.updateGroup(this.selectedItem.id, this.selectedItem).subscribe(
        () => {
          this.loadGrupos();
          this.closeItemDetails();
        },
        (error) => console.error('Error al actualizar el grupo:', error)
      );
    } else {
      this.hitzorduakService.updateLangile(this.selectedItem.id, this.selectedItem).subscribe(
        () => {
          this.loadLangileak();
          this.closeItemDetails();
        },
        (error) => console.error('Error al actualizar el langile:', error)
      );
    }
  }

  openAddItemModal(): void {
    // Implementar lógica para abrir modal de añadir ítem
  }
}
