import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-inbentario',
  templateUrl: './inbentario.page.html',
  styleUrls: ['./inbentario.page.scss'],
})
export class InbentarioPage {
  products = [
    { name: 'Producto 1', description: 'Descripción del Producto 1.', image: 'assets/producto1.jpg' },
    { name: 'Producto 2', description: 'Descripción del Producto 2.', image: 'assets/producto2.jpg' },
    { name: 'Producto 3', description: 'Descripción del Producto 3.', image: 'assets/producto3.jpg' },
    { name: 'Producto 4', description: 'Descripción del Producto 4.', image: 'assets/producto4.jpg' },
    { name: 'Producto 5', description: 'Descripción del Producto 5.', image: 'assets/producto5.jpg' },
  ];

  materials = [
    { name: 'Material 1', description: 'Descripción del Material 1.', image: 'assets/material1.jpg' },
    { name: 'Material 2', description: 'Descripción del Material 2.', image: 'assets/material2.jpg' },
    { name: 'Material 3', description: 'Descripción del Material 3.', image: 'assets/material3.jpg' },
    // Más materiales...
  ];

  filteredItems = [...this.products];  // Inicialmente muestra los productos
  currentSection = 'productos';  // 'productos' o 'materiales'
  selectedItem: any = null;

  constructor(private alertController: AlertController) {}

  // Este método se llama cuando se cambia el valor en el ion-segment
  segmentChanged() {
    this.filterItems(); // Aplicamos el filtro con el valor actual
  }

  filterItems(event?: any) {
    const query = event ? event.target.value.toLowerCase() : ''; // Si no se pasa evento, se toma el filtro vacío
    const items = this.currentSection === 'productos' ? this.products : this.materials;

    this.filteredItems = items.filter(item =>
      item.name.toLowerCase().includes(query)
    );
  }

  showItemDetails(item: any) {
    this.selectedItem = item;
  }

  closeItemDetails() {
    this.selectedItem = null;
  }
}
