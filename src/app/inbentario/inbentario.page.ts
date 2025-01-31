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
          id: materiala.id,
          name: materiala.izena,
          description: materiala.etiketa || 'No hay descripción',
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
          id: produktu.id,
          name: produktu.izena,
          description: produktu.deskribapena || 'Sin descripción',
          marka: produktu.marka || 'La marca no está añadida',
          stock: produktu.stock || 'No hay stock añadido',
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

  /**
   * Elimina un ítem (producto/material)
   */
  deleteItem(itemId: number, event: Event): void {
    event.stopPropagation();
    const confirm = this.alertController.create({
      header: 'Confirmar',
      message: '¿Seguro que quieres eliminar este ítem?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            if (this.currentSection === 'productos') {
              this.hitzorduakService.deleteProduktuak(itemId).subscribe(() => {
                this.loadProduktuak(); // Recargar productos
              });
            } else {
              this.hitzorduakService.deleteMaterialak(itemId).subscribe(() => {
                this.loadMateriala(); // Recargar materiales
              });
            }
          },
        },
      ],
    });
    confirm.then((alert) => alert.present());
  }

  saveChanges(): void {
    if (this.currentSection === 'productos') {
      this.hitzorduakService.updateProduktuak(this.selectedItem.id, this.selectedItem).subscribe(
        () => {
          this.loadProduktuak();
          this.closeItemDetails();
        },
        (error) => console.error('Error al actualizar el producto:', error)
      );
    } else {
      this.hitzorduakService.updateMaterialak(this.selectedItem.id, this.selectedItem).subscribe(
        () => {
          this.loadMateriala();
          this.closeItemDetails();
        },
        (error) => console.error('Error al actualizar el material:', error)
      );
    }
  }

  /**
   * Método para abrir el modal para agregar nuevos productos/materiales
   */
  openAddItemModal(): void {
    // Aquí puedes crear y abrir el modal para agregar un nuevo ítem
    // Puedes incluir un formulario para agregar los datos
  }
}


