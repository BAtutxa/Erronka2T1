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
  isAddItemModalOpen: boolean = false;
  newItem: any = { name: '', surname: '', kodea: '' };

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
          kodea: grupo.kodea,
          langileak: []
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
          kodea: langile.kodea,
          grupo: null
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
    if (this.currentSection === 'grupos') {
      this.selectedItem = { ...item, langileak: [] };
      this.hitzorduakService.getPersonsByGroup(item.kodea).subscribe((data: any) => {
        this.selectedItem.langileak = data;
        this.isModalOpen = true;
      });
    } else {
      this.selectedItem = item;

      this.hitzorduakService.getGroupByKodea(item.kodea).subscribe((data: any) => {
        this.selectedItem.grupo = data;
        this.isModalOpen = true;
      });
    }
  }
  closeItemDetails(): void {
    this.selectedItem = null;
    this.isModalOpen = false;
  }
}