import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-inbentario',
  templateUrl: './inbentario.page.html',
  styleUrls: ['./inbentario.page.scss'],
})
export class InbentarioPage{
  products = [
    {
      name: 'Producto 1',
      description: 'Descripción del Producto 1.',
      image: 'assets/producto1.jpg',
    },
    {
      name: 'Producto 2',
      description: 'Descripción del Producto 2.',
      image: 'assets/producto2.jpg',
    },
    {
      name: 'Producto 3',
      description: 'Descripción del Producto 3.',
      image: 'assets/producto3.jpg',
    },
    {
      name: 'Producto 4',
      description: 'Descripción del Producto 4.',
      image: 'assets/producto4.jpg',
    },
    {
      name: 'Producto 5',
      description: 'Descripción del Producto 5.',
      image: 'assets/producto5.jpg',
    },
  ];

  selectedProduct: any = null;

  constructor(private menuCtrl: MenuController) {}



  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(false);
  }

  showProductDetails(product: any) {
    this.selectedProduct = product;
  }

  closeProductDetails() {
    this.selectedProduct = null;
  }
}
