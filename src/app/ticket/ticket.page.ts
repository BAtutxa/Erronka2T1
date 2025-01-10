import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
})
export class TicketPage {

  constructor(private router: Router, private alertController: AlertController) { }

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
            this.logout(); // Llamada al método logout cuando el usuario confirma
          },
        },
      ],
    });

    await alert.present(); // Es necesario presentar el alert
  }

  logout(): void {
    this.router.navigate(['/home']); // Navegar a la página de inicio (puedes cambiar la ruta según tu aplicación)
  }
}
