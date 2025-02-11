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
  availableLangileak: any[] = [];
  selectedLangileToAdd: any = null;
  selectedLangileId: string | null = null;
  

  constructor(
    private menuCtrl: MenuController,
    private alertController: AlertController,
    private hitzorduakService: HitzorduakService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loadGrupos();
    this.loadLangileak();
  }

  loadGrupos(): void {
    this.hitzorduakService.getGroups().subscribe(
      (data) => {
        this.grupos = data.map((grupos) => ({
          id: grupos.kodea,
          name: grupos.izena
        }));
        if (this.currentSection === 'grupos') this.filterItems();
      },
      (error) => {
        console.error('Error al cargar grupos:', error);
      }
    );
  }
  
  
  loadLangileak(): void {
    this.hitzorduakService.getLangileak().subscribe(
      (data) => {
        this.langileak = data.map((langileak) => ({
          id: langileak.id,
          name: langileak.izena,
          abizena: langileak.abizenak,
          taldeak: langileak.taldeak ? {
            kodea: langileak.taldeak.kodea,
          } : null
        }));
        if (this.currentSection === 'grupos') this.filterItems();
      },
      (error) => {
        console.error('Error al cargar grupos:', error);
      }
    );
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
    if (item) {
      this.selectedItem = item;
      this.isModalOpen = true;
    }
  }
  

  closeItemDetails(): void {
    this.selectedItem = null;
    this.isModalOpen = false;
  }

  loadAvailableLangileak(): void {
    this.availableLangileak = this.langileak.filter(
      (langile) => !this.selectedItem.langileak.some((l: any) => l.id === langile.id)
    );
  }

  addLangileToGroup(): void {
    if (!this.selectedLangileToAdd) return;

    this.hitzorduakService.addPersonToGroup(this.selectedItem.kodea, this.selectedLangileToAdd.id).subscribe(
      () => {
        this.selectedItem.langileak.push(this.selectedLangileToAdd);
        this.loadAvailableLangileak();
        this.selectedLangileToAdd = null;
      },
      (error) => {
        console.error('Error al agregar langile:', error);
      }
    );
  }

  removeLangileFromGroup(langile: any): void {
    this.hitzorduakService.removePersonFromGroup(langile.id).subscribe(
      () => {
        this.selectedItem.langileak = this.selectedItem.langileak.filter((l: any) => l.id !== langile.id);
        this.loadAvailableLangileak();
      },
      (error) => {
        console.error('Error al eliminar langile:', error);
      }
    );
  }

  saveChanges(): void {
    if (this.currentSection === 'grupos') {
      const updatedLangile = {
        izena: this.selectedLangileToAdd.name,  // Ahora usa el nombre del seleccionado
        abizenak: this.selectedLangileToAdd.abizena,  // Usa el apellido del seleccionado
        taldeak: this.selectedItem ? { kodea: this.selectedItem.id } : null
      };
  
      this.hitzorduakService.updateLangileak(this.selectedLangileToAdd.id, updatedLangile).subscribe(
        () => {
          this.loadGrupos();
          this.loadLangileak();
          this.closeItemDetails();
        },
        (error) => console.error('Error al actualizar el producto:', error)
      );
    } else {
      const updateLangileak = {
        izena: this.selectedItem.name,
        abizenak: this.selectedItem.abizena,
        taldeak: this.selectedItem.taldeak ? { kodea: this.selectedItem.taldeak.kodea } : null
      };
  
      this.hitzorduakService.updateLangileak(this.selectedItem.id, updateLangileak).subscribe(
        () => {
          this.loadGrupos();
          this.loadLangileak();
          this.closeItemDetails();
        },
        (error) => console.error('Error al actualizar el material:', error)
      );
    }
  }
  
}