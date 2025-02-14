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
    etiketa: ''
  };

  filteredItems: any[] = [];
  currentSection: 'productos' | 'materiales' = 'productos';
  selectedItem: any = null;
  isModalOpen: boolean = false;
  isFormVisible = false;
  isDocumentModalOpen = false;

  cantidadRestar: number = 0; // Nueva variable para ingresar la cantidad a restar
  documentData = {
    fecha: '',
    langilea: null,
    cantidad: 0,
    item: null,
  };

  constructor(
    private alertController: AlertController,
    private hitzorduakService: HitzorduakService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadKategoriak();
  }

  loadData(): void {
    this.loadMateriala();
    this.loadProduktuak();
    this.loadLangileak();
  }

  loadMateriala(): void {
    this.hitzorduakService.getMaterialak().subscribe(
      (data) => {
        this.materiala = data.map((materiala) => ({
          id: materiala.id,
          name: materiala.izena,
          description: materiala.etiketa || 'No hay descripción',
          image: materiala.image || 'assets/default-image.png',
          type: 'material'
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
          stock: produktu.stock || 0,
          stockAlerta: produktu.stockAlerta || 0,
          image: produktu.image || 'assets/default-image.png',
          type: 'producto',
          kategoria: produktu.kategoriak && produktu.kategoriak.id
            ? { id: produktu.kategoriak.id, izena: produktu.kategoriak.izena }
            : null
        }));

        if (this.currentSection === 'productos') {
          this.filterItems();
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

  loadLangileak(): void {
    this.hitzorduakService.getLangileak().subscribe(
      (data) => {
        this.langileak = data.map((langileak) => ({
          id: langileak.id,
          izena: langileak.izena,
          abizena: langileak.abizena
        }));
      },
      (error) => {
        console.error('Error al cargar trabajadores:', error);
      }
    );
  }

  segmentChanged(): void {
    this.filterItems();
  }

  filterItems(event?: any): void {
    const query = event?.target?.value?.toLowerCase() || '';
    const items = this.currentSection === 'productos' ? this.produktuak : this.materiala;
    this.filteredItems = items.filter((item) => item.name.toLowerCase().includes(query));
  }

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }

  addItem() {
    if (this.currentSection === 'productos') {
        const productToAdd = {
            izena: this.newProduct.name,
            deskribapena: this.newProduct.description,
            marka: this.newProduct.marka,
            stock: this.newProduct.stock,
            stockAlerta: this.newProduct.stockAlerta,
            kategoriak: this.newProduct.kategoriak.id ? { id: this.newProduct.kategoriak.id } : null
        };

        console.log("📤 Enviando producto a la API:", JSON.stringify(productToAdd));

        this.hitzorduakService.createproduktu(productToAdd).subscribe(
            (newProduct) => {
                console.log('✅ Producto agregado:', newProduct);
                this.loadProduktuak();
                this.toggleForm();
            },
            (error) => {
                console.error('❌ Error al agregar producto:', error);
            }
        );
    }
  }

  showItemDetails(item: any): void {
    this.selectedItem = { ...item };
    this.cantidadRestar = 0;
    if (!this.selectedItem.kategoria) {
      this.selectedItem.kategoria = { id: null, izena: 'Sin categoría' };
    }
    this.isModalOpen = true;
  }

  closeItemDetails(): void {
    this.selectedItem = null;
    this.isModalOpen = false;
  }

  saveChanges(): void {
    if (this.selectedItem) {
      this.hitzorduakService.updateProduktuak(this.selectedItem.id, this.selectedItem).subscribe(
        () => {
          this.loadProduktuak();
          this.closeItemDetails();
        },
        (error) => console.error('Error al actualizar el producto:', error)
      );
    }
  }

  deleteItem(itemId: number, event: Event): void {
    event.stopPropagation();
    
    this.alertController.create({
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
              this.produktuak = this.produktuak.filter(item => item.id !== itemId);
              this.filterItems();

              this.hitzorduakService.deleteProduktuak(itemId).subscribe(
                () => console.log('Producto eliminado correctamente'),
                (error) => console.error('Error al eliminar producto:', error)
              );
            }
          }
        }
      ]
    }).then((alert) => alert.present());
  }
  
  isAdmin(): boolean{
    return this.hitzorduakService.hasRole('IR');
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

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }

  isDocumentModalOpen = false;
  documentData = {
    fecha: '',
    langilea: null,
    cantidad: 0,
    item: null,
  };

  openDocumentModal(item: any, event: Event): void {
    this.loadLangileak();
    event.stopPropagation();
    this.documentData = {
      fecha: new Date().toISOString(),
      langilea: this.langileak.length > 0 ? this.langileak[0].id : null,
      cantidad: 1,
      item: item
    };
    this.isDocumentModalOpen = true;
  }

  closeDocumentModal(): void {
    this.isDocumentModalOpen = false;
  }

  saveDocumentData(): void {
    console.log('Datos guardados:', this.documentData);
    this.closeDocumentModal();
  }


// Nueva propiedad para la cantidad a restar del stock

restarStock(): void {
  if (!this.selectedItem || !this.selectedItem.stock || this.cantidadRestar <= 0) {
    console.warn("⚠️ Ingresa una cantidad válida.");
    return;
  }

  if (this.selectedItem.stock < this.cantidadRestar) {
    console.warn("❌ No hay suficiente stock disponible.");
    return;
  }

  // Restar la cantidad al stock
  this.selectedItem.stock -= this.cantidadRestar;

  // Actualizar en la base de datos
  this.hitzorduakService.updateProduktuak(this.selectedItem.id, { stock: this.selectedItem.stock }).subscribe(
    () => {
      console.log(`✅ Stock actualizado: ${this.selectedItem.stock}`);
      this.loadProduktuak(); // Recargar la lista para reflejar los cambios
    },
    (error) => console.error('Error al actualizar el stock:', error)
  );

  this.cantidadRestar = 0; // Resetear campo de cantidad después de actualizar
}


}
