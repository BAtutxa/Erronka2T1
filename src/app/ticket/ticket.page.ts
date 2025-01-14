import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
})
export class TicketPage {

  ticket = {
    cliente: '',
    fecha: '',
    hora: '',
    servicio: '',
    precio: 0,
    pagado: 0,
    vueltas: 0,
    metodoPago: ''
  };

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

    await alert.present();
  }

  logout(): void {
    this.router.navigate(['/home']);
  }

  calcularVuelta(): void {
    if (this.ticket.pagado && this.ticket.precio) {
      this.ticket.vueltas = this.ticket.pagado - this.ticket.precio;
    }
  }

  sortuPDF(ticketForm: any) {
    if (ticketForm.valid) {
      // Generar PDF solo si el formulario es válido
      const pdf = new jsPDF();
      pdf.text('Ticket de Cita de Peluquería', 20, 20);
      pdf.text(`Cliente: ${this.ticket.cliente}`, 20, 30);
      pdf.text(`Fecha: ${this.ticket.fecha}`, 20, 40);
      pdf.text(`Hora: ${this.ticket.hora}`, 20, 50);
      pdf.text(`Servicio: ${this.ticket.servicio}`, 20, 60);
      pdf.text(`Precio: ${this.ticket.precio}€`, 20, 70);
      pdf.text(`Monto Pagado: ${this.ticket.pagado}€`, 20, 80);
      pdf.text(`Vueltas: ${this.ticket.vueltas}€`, 20, 90);
      pdf.text(`Método de Pago: ${this.ticket.metodoPago}`, 20, 100);
      pdf.save('ticket_peluqueria.pdf');
    } else {
      // Mostrar un mensaje si el formulario no es válido
      alert('Por favor, rellena todos los campos obligatorios.');
    }
  }
  
}
