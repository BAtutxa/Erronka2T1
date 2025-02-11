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
  kategoriak: any[] = [];
  langileak: any[] = [];


  newProduct = {
    name: '',
    description: '',
    marka: '',
    stock: 0,
    stockAlerta: 0,
    kategoriak: {
      id: null,
    }
  };
  
  newMaterial = {
    name: '',
    etiketa:''
  };
  

  filteredItems: any[] = [];
  currentSection: 'productos' | 'materiales' = 'productos';
  selectedItem: any = null;
  isModalOpen: boolean = false;
  isFormVisible = false;
  constructor(
    private alertController: AlertController,
    private hitzorduakService: HitzorduakService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadKategoriak();
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
          type: 'material' // Identificador de tipo
        }));
        if (this.currentSection === 'materiales') this.filterItems();
      },
      (error) => {
        console.error('Error al cargar materiales:', error);
      }
    );
  }

  loadLangileak(): void {
    this.hitzorduakService.getLangileak().subscribe(
      (data) => {
        this.langileak = data.map((langileak) => ({
          id: langileak.id,
          izena: langileak.izena,
          abizena: langileak.abizena
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
          stockAlerta: produktu.stockAlerta || 'No hay stock añadido',
          image: produktu.image || 'assets/default-image.png',
          type: 'producto',
          kategoria: produktu.kategoriak ? { id: produktu.kategoriak.id, izena: produktu.kategoriak.izena } : null
        }));
        
        if (this.currentSection === 'productos') {
          this.filterItems();
        }
  
        if (this.selectedItem && this.selectedItem.kategoria) {
          this.selectedItem.kategoria.id = this.selectedItem.kategoria.id || null;
        }
      },
      (error) => {
        console.error('Error al cargar productos:', error);
      }
    );
  }
  

  loadKategoriak(): void {
    this.hitzorduakService.getKategoriak().subscribe(
      (data) => {
        this.kategoriak = data.map((kategoria) => ({
          id: kategoria.id,
          izena: kategoria.izena
        }));
      },
      (error) => {
        console.error('Error al cargar categorías:', error);
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
  
    // Aquí aseguramos que la categoría está correctamente asignada
    if (this.selectedItem && this.selectedItem.kategoria) {
      this.selectedItem.kategoria.id = this.selectedItem.kategoria.id || null;
    }
  
    this.isModalOpen = true;
  }
  

  /**
   * Cierra los detalles del ítem
   */
  closeItemDetails(): void {
    this.selectedItem = null;
    this.isModalOpen = false;
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
      const updateProduct = {
        name: this.selectedItem.name,
        description: this.selectedItem.description,
        marka: this.selectedItem.marka,
        stock: this.selectedItem.stock,
        kategoriak: {
          id: this.selectedItem.kategoriak.id,
        }
      };
      this.hitzorduakService.updateProduktuak(this.selectedItem.id, updateProduct).subscribe(
        () => {
          this.loadProduktuak();
          this.closeItemDetails();
        },
        (error) => console.error('Error al actualizar el producto:', error)
      );
    } else {
      const updateMaterial = {
        name: this.selectedItem.name,
        etiketa: this.selectedItem.description
      };
      this.hitzorduakService.updateMaterialak(this.selectedItem.id, updateMaterial).subscribe(
        () => {
          this.loadMateriala();
          this.closeItemDetails();
        },
        (error) => console.error('Error al actualizar el material:', error)
      );
    }
  }
  
  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }
  
  addItem() {
    if (this.currentSection === 'productos') {
      // Aseguramos que la categoría seleccionada tenga el ID correcto
      const productToAdd = {
        name: this.newProduct.name,
        description: this.newProduct.description,
        marka: this.newProduct.marka,
        stock: this.newProduct.stock,
        stockAlerta: this.newProduct.stockAlerta,
        kategoriak: {
          id: this.newProduct.kategoriak.id,  // Guardamos el ID de la categoría seleccionada
        }
      };
  
      // Llamamos al servicio para crear el nuevo producto
      this.hitzorduakService.createproduktu(productToAdd).subscribe(
        () => {
          this.loadProduktuak(); // Recargamos la lista de productos después de agregar el nuevo
          this.resetProductForm(); // Limpiar el formulario de producto después de agregarlo
        },
        (error) => {
          console.error('Error al agregar producto:', error);
        }
      );
    } else {
      // Para materiales, no se requiere el ID de categoría
      const materialToAdd = {
        name: this.newMaterial.name,
        etiketa: this.newMaterial.etiketa,
      };
  
      // Llamamos al servicio para crear el nuevo material
      this.hitzorduakService.createMaterial(materialToAdd).subscribe(
        () => {
          this.loadMateriala(); // Recargamos la lista de materiales después de agregar el nuevo
          this.resetMaterialForm(); // Limpiar el formulario de material después de agregarlo
        },
        (error) => {
          console.error('Error al agregar material:', error);
        }
      );
    }
  
    // Ocultamos el formulario después de agregar el ítem
    this.toggleForm();
  }
  
  // Función para resetear el formulario del producto
  resetProductForm() {
    this.newProduct = {
      name: '',
      description: '',
      marka: '',
      stock: 0,
      stockAlerta: 0,
      kategoriak: {
        id: null,  // Reiniciamos el ID de la categoría
      }
    };
  }
  
  // Función para resetear el formulario del material
  resetMaterialForm() {
    this.newMaterial = {
      name: '',
      etiketa: ''
    };
  }

  isDocumentModalOpen = false;
documentData = {
  fecha: '',
  langilea: null,
  cantidad: 0,
  item: null,
};

// Método para abrir el modal con los datos del item seleccionado
openDocumentModal(item: any, event: Event): void {
  this.loadLangileak();
  event.stopPropagation(); // Evita eventos no deseados
  this.documentData = {
    fecha: new Date().toISOString(), // Fecha actual
    langilea: this.langileak.length > 0 ? this.langileak[0].id : null, 
    cantidad: 1,
    item: item
  };
  this.isDocumentModalOpen = true;
}


// Método para cerrar el modal
closeDocumentModal(): void {
  this.isDocumentModalOpen = false;
}

// Método para guardar los datos
saveDocumentData(): void {
  console.log('Datos guardados:', this.documentData);
  this.closeDocumentModal();
}

}
