import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importa Router para la navegación

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  email: string = '';  // Para almacenar el correo electrónico
  password: string = '';  // Para almacenar la contraseña

  constructor(private router: Router) {}

  // Método para verificar el login
  login() {
    // Aquí puedes poner la lógica para verificar email y contraseña
    if (this.email === 'ibai@gmail.com' && this.password === '123') {
      // Si las credenciales son correctas, navega a la página de citas
      this.router.navigate(['/citas']);
    } else {
      // Si las credenciales son incorrectas, muestra un mensaje de error
      alert('Email o contraseña incorrectos');
    }
  }
}
