import { Component } from '@angular/core';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
})
export class CitasPage {
  selectedDate: string = new Date().toISOString();
  isDatePickerOpen: boolean = false;

  setToday() {
    this.selectedDate = new Date().toISOString();
  }

  prevDay() {
    let date = new Date(this.selectedDate);
    date.setDate(date.getDate() - 1);
    this.selectedDate = date.toISOString();
  }

  nextDay() {
    let date = new Date(this.selectedDate);
    date.setDate(date.getDate() + 1);
    this.selectedDate = date.toISOString();
  }

  openDatePicker() {
    this.isDatePickerOpen = true;
  }

  closeDatePicker() {
    this.isDatePickerOpen = false;
  }

  confirmDate() {
    this.isDatePickerOpen = false;
  }
}
