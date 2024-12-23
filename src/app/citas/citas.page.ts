import { Component } from '@angular/core';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
})
export class CitasPage {
  today: string; // Fecha mínima
  errorMessage: string | null = null;

  // Lista de servicios disponibles
  services = [
    { name: 'Corte de cabello largo', selected: false },
    { name: 'Tinte completo', selected: false },
    { name: 'Peinado especial', selected: false },
    { name: 'Lavado y secado', selected: false },
  ];

  constructor() {
    const currentDate = new Date();
    this.today = currentDate.toISOString();
  }


  toggleService(service: any): void {
    service.selected = !service.selected;
  }
}
