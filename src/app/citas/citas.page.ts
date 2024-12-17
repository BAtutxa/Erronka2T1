import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
})
export class CitasPage implements OnInit { 
  minDate: string;
  constructor() {
    const today = new Date();
    this.minDate = today.toISOString();
  }
  ngOnInit() {
  }
}
