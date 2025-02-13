import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HitzorduakService } from '../services/hitzorduak.service';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
})
export class CitasPage implements OnInit {
  selectedDate: string = new Date().toISOString();
  isDatePickerOpen: boolean = false;

  citas: any[] = []; // Lista de citas obtenidas de la API
  hours: string[] = []; // Horas del calendario (cada 10 minutos)
  alturaPorMediaHora = 50; // 📏 Altura base en píxeles para 30 minutos

  constructor(private alertController: AlertController, private hitzorduakService: HitzorduakService) {
    this.generateHours();
  }

  ngOnInit() {
    this.loadCitas();
  }

  /**
   * Cargar las citas del día seleccionado desde la API.
   */
  loadCitas() {
    const formattedDate = this.selectedDate.split('T')[0]; // Formatear a YYYY-MM-DD
    this.hitzorduakService.getHitzorduak().subscribe(
      (data: any[]) => {
        this.citas = data.filter(cita => cita.data === formattedDate); // Filtrar por fecha
        console.log('📆 Citas cargadas:', this.citas);
      },
      (error) => {
        console.error('❌ Error al cargar citas:', error);
      }
    );
  }

  /**
   * Genera la lista de horas disponibles en la agenda cada 10 minutos.
   */
  generateHours() {
    let startHour = 10;
    let startMinute = 0;

    while (startHour < 15) {
      this.hours.push(this.formatHour(startHour, startMinute));
      startMinute += 10; // Ahora incrementamos de 10 en 10 minutos
      if (startMinute === 60) {
        startMinute = 0;
        startHour++;
      }
    }
  }

  /**
   * Formatea la hora en `HH:mm`.
   */
  formatHour(hour: number, minute: number): string {
    return `${hour < 10 ? '0' + hour : hour}:${minute === 0 ? '00' : minute}`;
  }

  /**
   * Calcula la altura de una cita basada en su duración.
   */
  calcularAltura(duracion: number): string {
    if (!duracion || duracion < 10) return `${this.alturaPorMediaHora / 3}px`; // Mínimo 10 min
    return `${(duracion / 30) * this.alturaPorMediaHora}px`;
  }

  /**
   * Convierte una hora en formato `HH:mm` a minutos totales desde las 00:00.
   */
  convertirHoraAMinutos(hora: string): number {
    if (!hora || !hora.includes(':')) return NaN;
    let [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  }

  /**
   * Calcula la posición vertical de la cita en la agenda.
   */
  calcularPosicion(horaInicio: string): string {
    let minutosDesdeInicio = this.convertirHoraAMinutos(horaInicio) - this.convertirHoraAMinutos('10:00');
    return `${(minutosDesdeInicio / 10) * (this.alturaPorMediaHora / 3)}px`; // Adaptado a intervalos de 10 min
  }

  /**
   * 📌 **Calcula en qué columna se colocará la cita (distribuye en 3 columnas)**
   */
  calcularColumna(cita: any): string {
    let index = this.citas.indexOf(cita) % 3; // Máximo 3 columnas antes de resetear
    let spacing = 220;
    return `${index * spacing}px`;
  }

  /**
   * 📌 **Abre una alerta con la información de la cita seleccionada**
   */
  async abrirInfoCita(cita: any) {
    const alert = await this.alertController.create({
      header: 'Detalles de la Cita',
      message: `
        <strong>Nombre:</strong> ${cita.izena} <br>
        <strong>Descripción:</strong> ${cita.deskribapena} <br>
        <strong>Inicio:</strong> ${cita.hasieraOrdua} <br>
        <strong>Fin:</strong> ${cita.amaieraOrdua}
      `,
      buttons: ['Cerrar']
    });

    await alert.present();
  }

  /**
   * Cambiar a la fecha de hoy.
   */
  setToday() {
    this.selectedDate = new Date().toISOString();
    this.loadCitas();
  }

  /**
   * Retroceder un día en la agenda.
   */
  prevDay() {
    let date = new Date(this.selectedDate);
    date.setDate(date.getDate() - 1);
    this.selectedDate = date.toISOString();
    this.loadCitas();
  }

  /**
   * Avanzar un día en la agenda.
   */
  nextDay() {
    let date = new Date(this.selectedDate);
    date.setDate(date.getDate() + 1);
    this.selectedDate = date.toISOString();
    this.loadCitas();
  }

  /**
   * Abrir el selector de fecha.
   */
  openDatePicker() {
    this.isDatePickerOpen = true;
  }

  /**
   * Cerrar el selector de fecha.
   */
  closeDatePicker() {
    this.isDatePickerOpen = false;
  }

  /**
   * Confirmar la selección de fecha.
   */
  confirmDate() {
    this.isDatePickerOpen = false;
    this.loadCitas();
  }

  /**
   * 📌 Abre una alerta con un formulario para añadir una nueva cita.
   */
  async abrirModalNuevaCita() {
    const alert = await this.alertController.create({
      header: 'Nueva Cita',
      inputs: [
        {
          name: 'izena',
          type: 'text',
          placeholder: 'Nombre del cliente'
        },
        {
          name: 'deskribapena',
          type: 'text',
          placeholder: 'Descripción'
        },
        {
          name: 'hasieraOrdua',
          type: 'time',
          label: 'Hora de inicio',
          value: this.formatHour(10, 0),
          min: '10:00',
          max: '14:50',
        },
        {
          name: 'amaieraOrdua',
          type: 'time',
          label: 'Hora de fin',
          value: this.formatHour(10, 10),
          min: '10:10',
          max: '15:00',
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Añadir',
          handler: (data) => {
            this.agregarCita(data);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * 📌 Agrega una cita a la base de datos y la muestra en la agenda sin recargar.
   */
  agregarCita(data: any) {
    const nuevaCita = {
      izena: data.izena,
      deskribapena: data.deskribapena,
      data: this.selectedDate.split('T')[0], // Formato YYYY-MM-DD
      hasieraOrdua: data.hasieraOrdua,
      amaieraOrdua: data.amaieraOrdua,
    };

    this.hitzorduakService.createHitzordua(nuevaCita).subscribe(
      (createdCita) => {
        console.log('✅ Cita agregada:', createdCita);
        
        // Añadir la nueva cita directamente al array sin necesidad de recargar la página
        this.citas.push(createdCita);
        
        // Refrescar la vista para que se muestre en la agenda
        this.loadCitas();
      },
      (error) => {
        console.error('❌ Error al agregar la cita:', error);
      }
    );
  }
}
