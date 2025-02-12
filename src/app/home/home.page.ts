import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HitzorduakService } from '../services/hitzorduak.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  email: string = '';
  password: string = '';
  emailError: string = '';
  passwordError: string = '';
  passError: string = ''; // Mensaje de error para credenciales incorrectas
  erabiltzaileak: any[] = [];

  constructor(private router: Router, private hitzorduakService: HitzorduakService) {}

  ngOnInit(): void {
    this.loadErabiltzaileak();
  }

  login() {
    this.emailError = '';
    this.passwordError = '';
    this.passError = '';
  
    let isValid = true;
  
    if (!this.email) {
      this.emailError = 'Email-a bete behar duzu.';
      isValid = false;
    }
  
    if (!this.password) {
      this.passwordError = 'Pasahitza bete behar duzu.';
      isValid = false;
    }
  
    if (!isValid) return;
  
    const user = this.erabiltzaileak.find(
      (erabiltzaile) => erabiltzaile.username === this.email && erabiltzaile.pasahitza === this.password
    );
  
    if (user) {
      this.router.navigate(['/citas']);
    } else {
      this.passError = 'Email edo pasahitza ez dira zuzendu.';
    }
  }

  loadErabiltzaileak(): void {
    this.hitzorduakService.getErabiltzaileak().subscribe(
      (data) => {
        this.erabiltzaileak = data.map((erabiltzaile) => ({
          username: erabiltzaile.username,
          pasahitza: erabiltzaile.pasahitza,
          rola: erabiltzaile.rola
        }));
      },
      (error) => {
        console.error('Error al cargar erabiltzaileak:', error);
      }
    );
  }
}
