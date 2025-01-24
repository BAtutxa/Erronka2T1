import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  email: string = '';
  password: string = '';
  emailError: string = '';
  passwordError: string = '';
  passError: string = ''; // Mensaje de error para las credenciales incorrectas

  constructor(private router: Router) {}

  // Método para verificar el login
  login() {
    // Resetear los mensajes de error
    this.emailError = '';
    this.passwordError = '';
    this.passError = '';

    let isValid = true;

    // Verificar si el email o la contraseña están vacíos
    if (!this.email) {
      this.emailError = 'Email-a bete behar duzu.';
      isValid = false;
    }

    if (!this.password) {
      this.passwordError = 'Pasahitza bete behar duzu.';
      isValid = false;
    }

    // Si los campos están completos, verificar las credenciales
    if (isValid) {
      if (this.email === 'ibai@gmail.com' && this.password === '123') {
        // Si las credenciales son correctas, navega a la página de citas
        this.router.navigate(['/citas']);
      } else {
        // Si las credenciales son incorrectas, muestra el mensaje de error debajo del botón
        this.passError = 'Email edo pasahitza ez dira zuzendu.';
      }
    }
  }
  
}
