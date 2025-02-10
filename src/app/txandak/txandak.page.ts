import { HitzorduakService } from './../services/hitzorduak.service';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';




@Component({
  selector: 'app-txandak',
  templateUrl: './txandak.page.html',
  styleUrls: ['./txandak.page.scss'],
})
export class TxandakPage implements OnInit {
  harrera: any[] = [];
  garbiketa: any[] = [];
  txandak: any[] = [];
  langileak: any[] = [];
  currentSection: 'harrera' | 'garbiketa' = 'harrera';
  fechaInicio: string = '';
  fechaFin: string = '';




  newTxandak = {
    mota: '',
    data: '',
    sortzeData: '',
    eguneratzeData: '',
    ezabatzeData: null,
    langileId: null // Nuevo: Asociar langile al txanda
  };




  constructor(private hitzorduakService: HitzorduakService, private alertController: AlertController) {}




  ngOnInit() {
    this.loadTxandak();
  }




  segmentChanged() {
    console.log('Sección actual:', this.currentSection);
  }




  loadTxandak(): void {
    this.hitzorduakService.getAllTxandak().subscribe(
      (txandakData) => {
        this.hitzorduakService.getLangileak().subscribe(
          (langileakData) => {
            this.txandak = txandakData.map((txandak) => {
              const langile = langileakData.find(l => l.id === txandak.langileId) || { izena: 'Desconocido', abizena: '' };




              return {
                id: txandak.id,
                type: txandak.mota,
                date: txandak.data,
                langileIzena: langile.izena,
                langileAbizena: langile.abizena
              };
            });




            this.harrera = this.txandak.filter(item => item.type === 'H');
            this.garbiketa = this.txandak.filter(item => item.type === 'G');
            this.filterbyDate();
          },
          (error) => console.error('Error al cargar los langileak:', error)
        );
      },
      (error) => console.error('Error al cargar los txandak:', error)
    );
  }




  deleteItem(itemId: number, event: Event): void {
    event.stopPropagation();
    this.alertController.create({
      header: 'Confirmar',
      message: '¿Seguro que quieres eliminar este ítem?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            this.txandak = this.txandak.filter(item => item.id !== itemId);
            this.harrera = this.txandak.filter(item => item.type === 'H');
            this.garbiketa = this.txandak.filter(item => item.type === 'G');
            this.filterbyDate();
          },
        },
      ],
    }).then(alert => alert.present());
  }




  filterbyDate(): void {
    let filtered = this.txandak;




    if (this.fechaInicio) {
      filtered = filtered.filter(item => item.date >= this.fechaInicio);
    }
    if (this.fechaFin) {
      filtered = filtered.filter(item => item.date <= this.fechaFin);
    }




    this.harrera = filtered.filter(item => item.type === 'H');
    this.garbiketa = filtered.filter(item => item.type === 'G');
  }




  filterToday(): void {
    const today = new Date().toISOString().split('T')[0];
    this.fechaInicio = today;
    this.fechaFin = today;
    this.filterbyDate();
  }




  resetFilter(): void {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.harrera = this.txandak.filter(item => item.type === 'H');
    this.garbiketa = this.txandak.filter(item => item.type === 'G');
  }
 
  async openAddItemModal() {
    const alert = await this.alertController.create({
      header: 'Añadir Nuevo Txanda',
      inputs: [
        {
          name: 'mota',
          type: 'text',
          placeholder: 'Tipo de Txanda (harrera/garbiketa)',
        },
        {
          name: 'data',
          type: 'date',
          placeholder: 'Fecha',
        },
        {
          name: 'langileIzena',
          type: 'text',
          placeholder: 'Nombre del Trabajador',
        },
        {
          name: 'langileAbizena',
          type: 'text',
          placeholder: 'Apellido del Trabajador',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Acción cancelada');
            return true;
          },
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (!data.mota || !data.data || !data.langileIzena || !data.langileAbizena) {
              console.log('Datos incompletos');
              return false; // Evita cerrar si los datos están incompletos
            }
 
            // Buscar el langileId basado en nombre y apellido
            const langile = this.langileak.find(
              (l) => l.izena === data.langileIzena && l.abizena === data.langileAbizena
            );
 
            if (!langile) {
              console.log('Trabajador no encontrado');
              return false;
            }
 
            // Crear un nuevo Txanda con el langileId correspondiente
            const nuevoTxanda = {
              id: this.txandak.length + 1, // Simulación de ID único
              type: data.mota,
              date: data.data,
              langileId: langile.id, // Asocia el langileId al Txanda
              langileIzena: langile.izena,
              langileAbizena: langile.abizena,
            };
 
            this.txandak.push(nuevoTxanda);
            this.harrera = this.txandak.filter((item) => item.type === 'harrera');
            this.garbiketa = this.txandak.filter((item) => item.type === 'garbiketa');
 
            console.log('Nuevo Txanda agregado:', nuevoTxanda);
            return true;
          },
        },
      ],
    });
 
    await alert.present();
  }
 
 
}
