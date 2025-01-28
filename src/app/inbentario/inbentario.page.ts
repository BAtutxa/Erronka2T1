import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HitzorduakService } from '../services/hitzorduak.service';

@Component({
  selector: 'app-inbentario',
  templateUrl: './inbentario.page.html',
  styleUrls: ['./inbentario.page.scss'],
})
export class InbentarioPage implements OnInit {
  materiala: any[] = [];
  produktuak: any[] = [];
  
  filteredItems: any[] = [];
  currentSection: 'productos' | 'materiales' = 'productos';
  selectedItem: any = null;

  constructor(
    private alertController: AlertController,
    private hitzorduakService: HitzorduakService
  ) {}

  ngOnInit(): void {
    this.loadData(); // Carga inicial de datos
  }

  /**
   * Carga los datos tanto de materiales como de productos
   */
  loadData(): void {
    this.loadMateriala();
    this.loadProduktuak();
  }

  loadMateriala(): void {
    this.hitzorduakService.getMaterialak().subscribe(
      (data) => {
        this.materiala = data.map((materiala) => ({
          name: materiala.izena,
          description: materiala.description || 'Sin descripción',
          image: materiala.image || 'assets/default-image.png',
        }));
        if (this.currentSection === 'materiales') this.filterItems();
      },
      (error) => {
        console.error('Error al cargar materiales:', error);
      }
    );
  }

  loadProduktuak(): void {
    this.hitzorduakService.getProduktuak().subscribe(
      (data) => {
        this.produktuak = data.map((produktu) => ({
          name: produktu.izena,
          description: produktu.description || 'Sin descripción',
          image: produktu.image || 'assets/default-image.png',
        }));
        if (this.currentSection === 'productos') this.filterItems();
      },
      (error) => {
        console.error('Error al cargar productos:', error);
      }
    );
  }

  /**
   * Se ejecuta cuando se cambia la sección (productos/materiales)
   */
  segmentChanged(): void {
    this.filterItems();
  }

  /**
   * Filtra los ítems según el término de búsqueda y la sección actual
   */
  filterItems(event?: any): void {
    const query = event?.target?.value?.toLowerCase() || '';
    const items = this.currentSection === 'productos' ? this.produktuak : this.materiala;
    this.filteredItems = items.filter((item) => item.name.toLowerCase().includes(query));
  }

  /**
   * Muestra los detalles del ítem seleccionado
   */
  showItemDetails(item: any): void {
    this.selectedItem = item;
  }

  /**
   * Cierra los detalles del ítem
   */
  closeItemDetails(): void {
    this.selectedItem = null;
  }
}