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
  services: any[] = [];

  citas: any[] = []; // Lista de citas obtenidas de la API
  hours: string[] = []; // Horas del calendario (cada 10 minutos)
  alturaPorMediaHora = 50; // 📏 Altura base en píxeles para 30 minutos

  constructor(private alertController: AlertController, private hitzorduakService: HitzorduakService) {
    this.generateHours();
  }

  ngOnInit() {
    this.loadCitas();
    this.loadServices(); // Cargar servicios
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
        etxekoa: ${cita.etxekoa ? 'Bai' : 'Ez'},
        telefonoa: ${cita.telefonoa},
        eserlekua: ${cita.eserlekua},
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

  async abrirModalNuevaCita() {
    this.nuevaCita = {
      izena: '',
      telefonoa: '',
      deskribapena: '',
      hasieraOrdua: '10:00',
      amaieraOrdua: '10:10',
      eserlekua: this.asignarEserlekua(),
      etxekoa: false,
      data: this.selectedDate.split('T')[0],
      id_zerbitzua: null, // Servicio seleccionado
      zerbitzuIzena: 'Selecciona un servicio' // ✅ Guardamos el nombre del servicio
    };
  
    this.mostrarFormularioCita(); // ✅ Llamamos directamente al formulario de la cita
  }
  
  /**
   * 📌 Función para mostrar el formulario de nueva cita con los datos actualizados.
   */
  async mostrarFormularioCita() {
    const alert = await this.alertController.create({
      header: 'Nueva Cita',
      inputs: [
        { name: 'izena', type: 'text', placeholder: 'Nombre del cliente', value: this.nuevaCita.izena },
        { name: 'telefonoa', type: 'tel', placeholder: 'Teléfono', value: this.nuevaCita.telefonoa },
        { name: 'deskribapena', type: 'text', placeholder: 'Descripción', value: this.nuevaCita.deskribapena },
        { name: 'hasieraOrdua', type: 'time', value: this.nuevaCita.hasieraOrdua },
        { name: 'amaieraOrdua', type: 'time', value: this.nuevaCita.amaieraOrdua },
        {
          name: 'eserlekua',
          type: 'text',
          value: `Asiento ${this.nuevaCita.eserlekua}`,
          disabled: true,
        },
        {
          name: 'etxekoa',
          type: 'checkbox',
          label: 'Etxekoa (del centro)',
          checked: this.nuevaCita.etxekoa,
        },
        // 📌 Botón de selección de servicio
        {
          name: 'zerbitzuIzena',
          type: 'text',
          value: this.nuevaCita.zerbitzuIzena,
          attributes: {
            readonly: true, // ✅ Solo se cambia a través del selector
          },
          handler: async () => {
            await this.mostrarSelectorServicios();
          }
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Elegir servicio',
          handler: async () => {
            await this.mostrarSelectorServicios();
          }
        },
        {
          text: 'Añadir',
          handler: (data) => {
            this.nuevaCita.izena = data.izena;
            this.nuevaCita.telefonoa = data.telefonoa;
            this.nuevaCita.deskribapena = data.deskribapena;
            this.nuevaCita.hasieraOrdua = data.hasieraOrdua;
            this.nuevaCita.amaieraOrdua = data.amaieraOrdua;
            this.nuevaCita.etxekoa = data.etxekoa;
  
            console.log("✅ Servicio seleccionado:", this.nuevaCita.id_zerbitzua, " - ", this.nuevaCita.zerbitzuIzena);
            this.agregarCita();
          },
        },
      ],
    });
  
    await alert.present();
  }
  
  /**
   * 📌 Función que muestra un selector de servicios en un nuevo AlertController
   */
  async mostrarSelectorServicios() {
    const alert = await this.alertController.create({
      header: 'Selecciona un servicio',
      inputs: this.services.map((servicio) => ({
        name: 'id_zerbitzua',
        type: 'radio',
        label: servicio.izena,
        value: servicio.id,
        checked: this.nuevaCita.id_zerbitzua === servicio.id
      })),
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'OK',
          handler: (selectedServiceId) => {
            // Guardamos el servicio seleccionado en `this.nuevaCita`
            const selectedService = this.services.find(s => s.id == selectedServiceId);
            if (selectedService) {
              this.nuevaCita.id_zerbitzua = selectedServiceId;
              this.nuevaCita.zerbitzuIzena = selectedService.izena; // ✅ Guardamos el nombre del servicio también
            }
  
            console.log("✅ Servicio seleccionado:", this.nuevaCita.id_zerbitzua, " - ", this.nuevaCita.zerbitzuIzena);
            
            // ✅ Reabrimos la alerta principal con los datos actualizados
            this.mostrarFormularioCita();
          },
        },
      ],
    });
  
    await alert.present();
  }

  loadServices() {
    this.hitzorduakService.getZerbitzuak().subscribe(
      (data) => {
        this.services = data;
        console.log("✅ Servicios cargados:", this.services); // ⬅️ Verifica que hay datos aquí
      },
      (error) => {
        console.error("❌ Error al cargar servicios:", error);
      }
    );
  }
  
  /**
   * 📌 Agrega una cita a la base de datos y la muestra en la agenda sin recargar.
   */
  agregarCita() {
    if (!this.nuevaCita.izena || !this.nuevaCita.hasieraOrdua || !this.nuevaCita.amaieraOrdua || !this.nuevaCita.data) {
      console.warn("⚠️ Falta información obligatoria para crear la cita.");
      return;
    }
  
    const citaAEnviar = {
      izena: this.nuevaCita.izena,
      telefonoa: this.nuevaCita.telefonoa,
      deskribapena: this.nuevaCita.deskribapena,
      hasieraOrdua: this.nuevaCita.hasieraOrdua,
      amaieraOrdua: this.nuevaCita.amaieraOrdua,
      eserlekua: this.nuevaCita.eserlekua,
      etxekoa: this.nuevaCita.etxekoa ? 'E' : 'K', // 🟢 La base de datos espera 'E' o 'K'
      data: this.nuevaCita.data // 🟢 Asegurar que se envía la fecha
    };
  
    console.log("📤 Enviando cita a la API:", citaAEnviar);
  
    this.hitzorduakService.createHitzordua(citaAEnviar).subscribe(
      (createdCita) => {
        console.log('✅ Cita agregada:', createdCita);
        this.citas.push(createdCita);
        this.loadCitas();
      },
      (error) => {
        console.error('❌ Error al agregar la cita:', error);
      }
    );
  }
  
  
  
  

  asignarEserlekua(): string {
    const asientosDisponibles = ['1', '2', '3', '4', '5']; // Asientos en formato string
    const asientosOcupados = this.citas.map((cita) => cita.eserlekua.toString());
  
    // Encuentra el primer asiento libre
    const asientoLibre = asientosDisponibles.find((asiento) => !asientosOcupados.includes(asiento));
  
    if (asientoLibre) {
      console.log(`✅ Asignando asiento ${asientoLibre}`);
      return asientoLibre;
    } else {
      console.warn('❌ No hay asientos disponibles');
      return 'No disponible'; // Mensaje de error si no hay asientos libres
    }
  }
  
  

  // Propiedad para manejar el estado del modal
isModalNuevaCitaOpen: boolean = false;

// Propiedad para almacenar los datos de la nueva cita
nuevaCita = {
  izena: '',
  telefonoa: '',
  deskribapena: '',
  hasieraOrdua: '',
  amaieraOrdua: '',
  eserlekua: '',
  etxekoa: false,
  data: '', // 🟢 Asegurar que data esté presente
  id_zerbitzua: null, // ✅ Ahora está definido en nuevaCita
  zerbitzuIzena: '' // ✅ Ahora está definido en nuevaCita
};



// Método para abrir el modal

// Método para cerrar el modal
cerrarModalNuevaCita() {
  this.isModalNuevaCitaOpen = false;
}

// Método para guardar la cita
guardarCita() {
  console.log("📤 Datos de la nueva cita antes de enviar:", this.nuevaCita);

  // Validar que los campos obligatorios no estén vacíos
  if (!this.nuevaCita.izena || !this.nuevaCita.hasieraOrdua || !this.nuevaCita.amaieraOrdua) {
    console.warn("⚠️ Faltan datos obligatorios.");
    return;
  }

  // Convertir `etxekoa` en 'E' o 'K'
  this.nuevaCita.etxekoa = this.nuevaCita.etxekoa ? true : false;

  this.hitzorduakService.createHitzordua(this.nuevaCita).subscribe(
    (createdCita) => {
      console.log("✅ Cita agregada:", createdCita);

      // Añadir la cita a la lista sin recargar
      this.citas.push(createdCita);
      this.cerrarModalNuevaCita();
    },
    (error) => {
      console.error("❌ Error al agregar la cita:", error);
    }
  );
}
  
}
