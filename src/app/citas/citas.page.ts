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
    const formattedDate = this.selectedDate.split('T')[0]; // Formato YYYY-MM-DD
    this.hitzorduakService.getHitzorduak().subscribe(
      (data: any[]) => {
        console.log("📆 Citas cargadas desde API:", data);
        this.citas = data.filter(cita => cita.data === formattedDate); // Filtrar por fecha
        console.log("📆 Citas filtradas por fecha:", this.citas);
      },
      (error) => {
        console.error("❌ Error al cargar citas:", error);
      }
    );
  }

  generateHours() {
    let startHour = 8;
    while (startHour < 15) {
      this.hours.push(this.formatHour(startHour, 0)); // Siempre con minutos en 0
      startHour++; // Incrementamos la hora en lugar de los minutos
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
  calcularAltura(horaInicio: string, horaFin: string): string {
    const minutosInicio = this.convertirHoraAMinutos(horaInicio);
    const minutosFin = this.convertirHoraAMinutos(horaFin);
    const duracion = minutosFin - minutosInicio;
  
    // Asegurarnos de que la duración no sea negativa o cero
    if (duracion <= 0) {
      return `${this.alturaPorMediaHora / 3}px`; // Mínimo 10 min
    }
  
    // Calculamos la altura en función de la duración
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
    if (!horaInicio) return '0px';
  
    const minutosDesdeInicio = this.convertirHoraAMinutos(horaInicio) - this.convertirHoraAMinutos('08:00');
    return `${(minutosDesdeInicio / 10) * (this.alturaPorMediaHora / 3)}px`;
  }

  /**
   * 📌 **Calcula en qué columna se colocará la cita (distribuye en 3 columnas)**
   */
  calcularColumna(cita: any): string {
    const horaInicio = cita.hasieraOrdua;
    // Crear un identificador único para cada hora
    const indexByTime = this.citas.filter(c => c.hasieraOrdua === horaInicio).indexOf(cita);
    let spacing = 220; // Espacio entre columnas
  
    // Desplazar cada cita según el índice dentro de su hora de inicio
    return `${indexByTime * spacing}px`;
  }

  /**
   * 📌 **Abre una alerta con la información de la cita seleccionada**
   */
  async abrirInfoCita(cita: any) {
    const alert = await this.alertController.create({
      header: 'Detalles de la Cita',
      message: `
        izena: ${cita.izena} , 
        deskribapena: ${cita.deskribapena} ,
        hasiera ordua: ${cita.hasieraOrdua} , 
        amaiera ordua: ${cita.amaieraOrdua} , 
        etxekoa: ${cita.etxekoa ? 'Bai' : 'Ez'}
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
          value: this.formatHour(10, 0),
          min: '10:00',
          max: '14:50',
        },
        {
          name: 'amaieraOrdua',
          type: 'time',
          value: this.formatHour(10, 10),
          min: '10:10',
          max: '15:00',
        },
        {
          name: 'etxekoa',
          type: 'checkbox',
          label: 'etxekoa',
          value: true // Por defecto, desmarcado
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
            console.log("Datos de la nueva cita:", data);
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
    const asientoLibre = this.buscarAsientoLibre(); // 🔥 Busca un asiento libre
    if (asientoLibre === null) {
      console.warn("⚠️ No hay asientos disponibles.");
      return;
    }
  
    console.log("📤 Enviando cita a la API:", this.nuevaCita);
  
    this.hitzorduakService.createHitzordua(this.nuevaCita).subscribe(
      (createdCita) => {
        console.log("✅ Cita agregada:", createdCita);
        this.citas.push(createdCita);
        this.loadCitas(); // Recargar la agenda
      },
      (error) => {
        console.error("❌ Error al agregar la cita:", error);
      }
    );
  }
  

  buscarAsientoLibre(): number | null {
    const asientosDisponibles = [1, 2, 3, 4, 5]; // 🔥 5 asientos en la peluquería
    const asientosOcupados = this.citas.map(cita => cita.eserlekua); // 🔥 Asientos ya usados
  
    // 🔥 Encuentra el primer asiento libre
    for (const asiento of asientosDisponibles) {
      if (!asientosOcupados.includes(asiento)) {
        return asiento;
      }
    }
  
    return null; // ❌ No hay asientos libres
  }

  // Propiedad para manejar el estado del modal
isModalNuevaCitaOpen: boolean = false;

// Propiedad para almacenar los datos de la nueva cita
nuevaCita: any = {
  izena: '',
  telefonoa: '',
  deskribapena: '',
  hasieraOrdua: '',
  amaieraOrdua: '',
  eserlekua: '',
  etxekoa: false,
};

// Método para abrir el modal

// Método para cerrar el modal
cerrarModalNuevaCita() {
  this.isModalNuevaCitaOpen = false;
}

// Método para guardar la cita
guardarCita() {
  console.log("📤 Enviando cita:", this.nuevaCita);

  // Aquí puedes validar los datos antes de enviarlos
  if (!this.nuevaCita.izena || !this.nuevaCita.hasieraOrdua || !this.nuevaCita.amaieraOrdua) {
    console.warn("⚠️ Faltan datos obligatorios.");
    return;
  }

  // Convertir el checkbox en 'E' o 'K'
  this.nuevaCita.etxekoa = this.nuevaCita.etxekoa ? 'E' : 'K';

  this.hitzorduakService.createHitzordua(this.nuevaCita).subscribe(
    (createdCita) => {
      console.log("✅ Cita agregada:", createdCita);

      // Añadir la nueva cita sin recargar la página
      this.citas.push(createdCita);

      // Cerrar el modal
      this.cerrarModalNuevaCita();
    },
    (error) => {
      console.error("❌ Error al agregar la cita:", error);
    }
  );
}

  
}
