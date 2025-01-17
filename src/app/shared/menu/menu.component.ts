import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  titulo!: string;
  menuItems = [
    { label: 'Hitzorduak', route: '/citas', icon: 'assets/Fotos/citas.png', titulo: 'Hitzorduak' },
    { label: 'Inbentario', route: '/inbentario', icon: 'assets/Fotos/inbentario.png', titulo: 'Inbentario' },
    { label: 'Fitxategi bezeroak', route: '/bezero', icon: 'assets/Fotos/BezeroFitxa.png', titulo: 'Fitxategi bezeroak' },
    { label: 'Taldeak', route: '/grupos', icon: 'assets/Fotos/equipo.png', titulo: 'Taldeak' },
    { label: 'Asistentzia', route: '/asistentzia', icon: 'assets/Fotos/asist.png', titulo: 'Asistentzia' },
    { label: 'Garbiketa', route: '/limpieza', icon: 'assets/Fotos/garbi.png', titulo: 'Garbiketa' },
    { label: 'Ticket', route: '/ticket', icon: 'assets/Fotos/recibo.png', titulo: 'Ticket' },
  ];
  
  private routerSubscription!: Subscription;
  

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private alertController: AlertController) {}

  

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateTitle();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  updateTitle(): void {
    const currentRoute = this.router.url.split('/')[1]; // Get the first part of the route
    const currentItem = this.menuItems.find(item => item.route === `/${currentRoute}`);
    if (currentItem) {
      this.titulo = currentItem.titulo;
    }
  }

  logout(): void {
    this.router.navigate(['/home']);
  }

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
            this.logout();
          },
        },
      ],
    });

    await alert.present();
  }
}
