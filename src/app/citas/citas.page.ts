import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
})
export class CitasPage {
  today: string; // Fecha mínima para el calendario
  selectedDate: string | null = null; // Fecha seleccionada
  services = [
    { name: 'Corte de cabello largo', selected: false },
    { name: 'Tinte completo', selected: false },
    { name: 'Peinado especial', selected: false },
    { name: 'Lavado y secado', selected: false },
  ];
  showErrorMessage = false; // Mostrar mensaje de error

  constructor(private alertController: AlertController) {
    // Configuración de la fecha mínima
    this.today = new Date().toISOString();
  }

  /**
   * Verifica si el botón "Confirmar" debe estar habilitado.
   */
  isButtonDisabled(): boolean {
    return !this.selectedDate || !this.services.some((s) => s.selected);
  }

  /**
   * Maneja el envío de la cita.
   */
  async onSubmit(): Promise<void> {
    if (this.isButtonDisabled()) {
      this.showErrorMessage = true;
    } else {
      this.showErrorMessage = false;

      const selectedServices = this.services
        .filter((service) => service.selected)
        .map((service) => service.name);

      const alert = await this.alertController.create({
        header: 'Cita Confirmada',
        message: `
          Fecha: ${this.selectedDate}
          Servicios: ${selectedServices.join(', ')}
        `,
        buttons: ['OK'],
      });

      await alert.present();
    }
  }

  /**
   * Maneja el cambio en la fecha seleccionada.
   */
  onDateChange(event: any): void {
    this.selectedDate = event.detail.value;
  }
}
