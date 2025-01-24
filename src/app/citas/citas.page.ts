import { Component, Inject, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HitzorduakService } from '../services/hitzorduak.service';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
})
export class CitasPage implements OnInit {
  today: string; // Fecha mínima para el calendario
  selectedDate: string | null = null; // Fecha seleccionada
  services: any[] = []; // Servicios disponibles
  showErrorMessage = false; // Mostrar mensaje de error

  constructor(
    private alertController: AlertController,
    @Inject(HitzorduakService)
    private hs: HitzorduakService
  ) {
    this.today = new Date().toISOString();
  }

  ngOnInit() {
    this.loadServices();
  }

  // Cargar servicios desde la API
  loadServices(): void {
    this.hs.getZerbitzuak().subscribe(
      (data) => {
        this.services = data.map((service) => ({
          name: service.izena,
          selected: false,
        }));
      },
      (error) => {
        console.error('Error al cargar servicios:', error);
      }
    );
  }

  isButtonDisabled(): boolean {
    return !this.selectedDate || !this.services.some((s) => s.selected);
  }

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

  onDateChange(event: any): void {
    this.selectedDate = event.detail.value;
  }
}
