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
  availableLangileak: any[] = [];

  cantidadRestar: number = 0;
  selectedLangilea: number | null = null;




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


  constructor(
    private alertController: AlertController,
    private hitzorduakService: HitzorduakService
  ) {}


  ngOnInit(): void {
    this.loadData();
    this.loadKategoriak();
    this.loadLangileak(); 
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


                // Recargar la lista de productos desde la API para asegurarnos de que se refleje en la vista
                this.loadProduktuak();


                this.toggleForm(); // Cierra el formulario después de añadir
            },
            (error) => {
                console.error('❌ Error al agregar producto:', error);
            }
        );
    } else {
        const materialToAdd = {
            izena: this.newMaterial.name,
            etiketa: this.newMaterial.etiketa
        };


        console.log("📤 Enviando material a la API:", JSON.stringify(materialToAdd));


        this.hitzorduakService.createMaterial(materialToAdd).subscribe(
            (newMaterial) => {
                console.log('✅ Material agregado:', newMaterial);


                // Recargar la lista de materiales desde la API para asegurarnos de que se refleje en la vista
                this.loadMateriala();


                this.toggleForm(); // Cierra el formulario después de añadir
            },
            (error) => {
                console.error('❌ Error al agregar material:', error);
            }
        );
    }
}


 
 


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
                type: 'material',
                estaEnUso: false, // ❌ Inicialmente no está en uso
                usadoPor: null   // ❌ No hay nadie usándolo
            }));

            if (this.currentSection === 'materiales') this.filterItems();
        },
        (error) => {
            console.error("❌ Error al cargar materiales:", error);
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
        if (this.currentSection === 'materiales') this.filterItems();
      },
      (error) => {
        console.error('Error al cargar grupos:', error);
      }
    );
  }
  loadAvailableLangileak(): void {
    this.availableLangileak = this.langileak.filter(
      (langile) => !this.selectedItem.langileak.some((l: any) => l.id === langile.id)
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


  segmentChanged(): void {
    this.filterItems();
  }


  filterItems(event?: any): void {
    const query = event?.target?.value?.toLowerCase() || '';
    const items = this.currentSection === 'productos' ? this.produktuak : this.materiala;
    this.filteredItems = items.filter((item) => item.name.toLowerCase().includes(query));
  }


  showItemDetails(item: any): void {
    this.selectedItem = { ...item };
    if (!this.selectedItem.kategoria) {
      this.selectedItem.kategoria = { id: null, izena: 'Sin categoría' };
    }
  
    // Cargar el estado actual del material (si está en uso y quién lo tiene)
    this.hitzorduakService.getHistorialMaterial(item.id).subscribe(
      (data) => {
        if (data && data.length > 0) {
          const ultimoRegistro = data[data.length - 1];
          this.selectedItem.estaEnUso = !ultimoRegistro.amaiera_data; // Si no tiene fecha de devolución, está en uso
          this.selectedItem.usadoPor = this.selectedItem.estaEnUso
            ? `${ultimoRegistro.langile.izena} ${ultimoRegistro.langile.abizena}`
            : null;
        } else {
          this.selectedItem.estaEnUso = false;
          this.selectedItem.usadoPor = null;
        }
      },
      (error) => console.error('Error al obtener historial del material:', error)
    );
  
    this.isModalOpen = true;
  }
  


  closeItemDetails(): void {
    this.selectedItem = null;
    this.isModalOpen = false;
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
            console.log('Intentando eliminar item con ID:', itemId);
 
            if (this.currentSection === 'productos') {
              // Eliminar del array local antes de la petición HTTP
              this.produktuak = this.produktuak.filter(item => item.id !== itemId);
              this.filterItems();
 
              this.hitzorduakService.deleteProduktuak(itemId).subscribe(
                () => {
                  console.log('Producto eliminado correctamente');
                },
                (error) => console.error('Error al eliminar producto:', error)
              );
            } else {
              // Eliminar del array local antes de la petición HTTP
              this.materiala = this.materiala.filter(item => item.id !== itemId);
              this.filterItems();
 
              this.hitzorduakService.deleteMaterialak(itemId).subscribe(
                () => {
                  console.log('Material eliminado correctamente');
                },
                (error) => console.error('Error al eliminar material:', error)
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
  restarStock(): void {
    if (!this.selectedItem || !this.selectedItem.stock || this.cantidadRestar <= 0) {
      console.warn("⚠️ Ingresa una cantidad válida.");
      return;
    }

    if (this.selectedItem.stock < this.cantidadRestar) {
      console.warn("❌ No hay suficiente stock disponible.");
      return;
    }

    this.selectedItem.stock -= this.cantidadRestar;

    this.hitzorduakService.updateProduktuak(this.selectedItem.id, { stock: this.selectedItem.stock }).subscribe(
      () => {
        console.log(`✅ Stock actualizado: ${this.selectedItem.stock}`);
        this.loadProduktuak();
      },
      (error) => console.error('Error al actualizar el stock:', error)
    );

    this.cantidadRestar = 0;
  }

  registrarRecogida(material: any): void {
    if (!this.selectedLangilea) {
        console.warn("⚠️ Debes seleccionar un trabajador.");
        return;
    }

    // Buscar el trabajador seleccionado en la lista
    const trabajador = this.langileak.find(l => l.id === this.selectedLangilea);

    if (!trabajador) {
        console.warn("❌ No se encontró el trabajador.");
        return;
    }

    // Buscar el material en la lista general y actualizarlo
    const materialIndex = this.materiala.findIndex(m => m.id === material.id);
    if (materialIndex !== -1) {
        this.materiala[materialIndex].estaEnUso = true;
        this.materiala[materialIndex].usadoPor = `${trabajador.name} ${trabajador.abizena}`;
    }

    console.log(`✅ ${material.name} recogido por ${this.materiala[materialIndex].usadoPor}`);

    this.showItemDetails(this.materiala[materialIndex]); // Refrescar detalles sin perder datos
}

registrarDevolucion(material: any): void {
  // Buscar el material en la lista general y actualizarlo
  const materialIndex = this.materiala.findIndex(m => m.id === material.id);
  if (materialIndex !== -1) {
      this.materiala[materialIndex].estaEnUso = false;
      this.materiala[materialIndex].usadoPor = null;
  }

  console.log(`✅ ${material.name} ha sido devuelto`);

  this.showItemDetails(this.materiala[materialIndex]); // Refrescar detalles sin perder datos
}

}
