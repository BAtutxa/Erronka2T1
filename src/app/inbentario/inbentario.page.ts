import { Component } from '@angular/core';
import { MenuController,AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
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

  filteredProducts = [...this.products];
  selectedProduct: any = null;

  constructor(private menuCtrl: MenuController, private router: Router, private alertController: AlertController) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(false);
  }

  filterProducts(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(query)
    );
  }

  showProductDetails(product: any) {
    this.selectedProduct = product;
  }

  closeProductDetails() {
    this.selectedProduct = null;
  }

  addProduct() {
    console.log('Agregar producto: función no implementada');
    // Aquí puedes implementar la lógica para agregar un nuevo producto
  }

  async presentLogoutAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Cerrar sesión',
          handler: () => {
            this.logout();
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Lógica de cierre de sesión.
   */
  logout(): void {
    // Añade aquí la lógica de cierre de sesión, como borrar datos de sesión
    this.router.navigate(['/home']);
  }

}
