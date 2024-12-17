import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
})
export class CitasPage {
  menuItems: string[] = [
    'Hitzorduak',
    'Profila',
    'Zerbitzuak',
    'Historia',
    'Ezarpenak',
    'Fakturak',
    'Laguntza',
    'Notifikazioak',
    'Kontaktuak',
    'Itxi saioa',
  ];
  currentItem: string = 'Hitzorduak';

  teams: string[] = ['Talde A', 'Talde B', 'Talde C'];
  selectedTeam: string | null = null;

  months: string[] = [
    'Urtarrila', 'Otsaila', 'Martxoa', 'Apirila', 'Maiatza', 'Ekaina',
    'Uztaila', 'Abuztua', 'Iraila', 'Urria', 'Azaroa', 'Abendua'
  ];
  currentMonthIndex: number = new Date().getMonth(); // Este es el índice del mes actual
  currentYear: number = new Date().getFullYear();
  availableDays: number[] = this.generateAvailableDays();
  selectedDay: number | null = null;

  availableHours: string[] = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00'];
  selectedHour: string | null = null;

  services: { name: string; selected: boolean }[] = [
    { name: 'Garbiketa + ile luzea', selected: false },
    { name: 'Garbiketa + ile motza', selected: false },
    { name: 'Garbiketa + ile ertaina', selected: false },
  ];

  constructor(private menuCtrl: MenuController) {}

  selectMenuItem(item: string) {
    this.currentItem = item;
  }

  prevMonth() {
    if (this.currentMonthIndex === 0) {
      this.currentMonthIndex = 11;
      this.currentYear--;
    } else {
      this.currentMonthIndex--;
    }
    this.availableDays = this.generateAvailableDays();
  }

  nextMonth() {
    if (this.currentMonthIndex === 11) {
      this.currentMonthIndex = 0;
      this.currentYear++;
    } else {
      this.currentMonthIndex++;
    }
    this.availableDays = this.generateAvailableDays();
  }

  generateAvailableDays(): number[] {
    const daysInMonth = new Date(this.currentYear, this.currentMonthIndex + 1, 0).getDate();
    let days: number[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      let date = new Date(this.currentYear, this.currentMonthIndex, i);
      let dayOfWeek = date.getDay(); // 0 - Domingo, 1 - Lunes, 2 - Martes, etc.
      if (dayOfWeek === 2 || dayOfWeek === 3 || dayOfWeek === 4) { // Martes, Miércoles, Jueves
        days.push(i);
      }
    }
    return days;
  }

  selectDay(day: number) {
    this.selectedDay = day;
  }

  selectHour(hour: string) {
    this.selectedHour = hour;
  }

  toggleService(service: any) {
    service.selected = !service.selected;
  }

  isFormComplete(): boolean {
    return this.selectedDay != null && this.selectedHour != null && this.selectedTeam != null;
  }

  confirmAppointment() {
    if (this.isFormComplete()) {
      console.log('Cita confirmada:', {
        team: this.selectedTeam,
        day: this.selectedDay,
        hour: this.selectedHour,
        services: this.services.filter(service => service.selected).map(service => service.name),
      });
    } else {
      console.error('Faltan datos para confirmar la cita.');
    }
  }
}
