import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  // Array dinámico para el menú
  menuItems = [
    { label: 'Hitzorduak', route: '/citas', icon: 'assets/Fotos/citas.png' },
    { label: 'Inbentario', route: '/inbentario', icon: 'assets/Fotos/inbentario.png' },
    { label: 'Taldeak', route: '/grupos', icon: 'assets/Fotos/equipo.png' },
    { label: 'Asistentzia', route: '/asistentzia', icon: 'assets/Fotos/asist.png' },
    { label: 'Ticket', route: '/ticket', icon: 'assets/Fotos/recibo.png' },
    { label: 'Garbiketa', route: '/garbiketa', icon: 'assets/Fotos/garbi.png' },
  ];

  constructor() {}
}
