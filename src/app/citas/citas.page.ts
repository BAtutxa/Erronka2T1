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
  showErrorMessage = false; // Controla la visibilidad del mensaje de error

  constructor() {
    // Configuración de la fecha mínima
    this.today = new Date().toISOString();
  }

  /**
   * Verifica si el botón "Baieztatu" debe estar habilitado.
   * El botón se habilita si al menos un servicio está seleccionado y la fecha y hora están definidas.
   */
  isButtonDisabled(): boolean {
    const isServiceSelected = this.services.some(service => service.selected);
    return !isServiceSelected || !this.selectedDate; // El botón estará deshabilitado si no hay servicio seleccionado o no hay fecha/hora
  }

  /**
   * Maneja el evento de clic en el botón "Baieztatu".
   * Muestra el mensaje de error si los campos no están correctamente llenados.
   */
  onSubmit(): void {
    const isServiceSelected = this.services.some(service => service.selected);
    if (!isServiceSelected || !this.selectedDate) {
      this.showErrorMessage = true; // Muestra el mensaje de error si falta completar algo
    } else {
      // Aquí puedes proceder con la lógica para confirmar la cita
      console.log('Cita confirmada');
    }
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
   * @param event El evento que contiene la nueva fecha seleccionada.
   */
  onDateChange(event: any): void {
    this.selectedDate = event.detail.value; // Asignamos el valor de la fecha seleccionada
    console.log('Fecha seleccionada:', this.selectedDate);
  }
}
