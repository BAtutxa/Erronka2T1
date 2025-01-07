import { Component } from '@angular/core';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
})
export class CitasPage {
  today: string; // Fecha mínima para el calendario
  selectedDate: string | null = null; // Fecha seleccionada vinculada a [(ngModel)]
  services = [
    { name: 'Corte de cabello largo', selected: false },
    { name: 'Tinte completo', selected: false },
    { name: 'Peinado especial', selected: false },
    { name: 'Lavado y secado', selected: false },
  ];

  constructor() {
    // Configuración de la fecha mínima
    this.today = new Date().toISOString();
  }

  /**
   * Alterna el estado seleccionado de un servicio.
   * @param service El servicio a modificar.
   */
  toggleService(service: { name: string; selected: boolean }): void {
    service.selected = !service.selected;
  }

  /**
   * Maneja cambios en la fecha seleccionada.
   * @param date La nueva fecha seleccionada.
   */
  onDateChange(date: string): void {
    this.selectedDate = date;
    console.log('Fecha seleccionada:', this.selectedDate);
  }
}
