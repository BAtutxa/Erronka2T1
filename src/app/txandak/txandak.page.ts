import { HitzorduakService } from './../services/hitzorduak.service';
import { Component, OnInit } from '@angular/core';
import { AlertController,ModalController } from '@ionic/angular';




@Component({
  selector: 'app-txandak',
  templateUrl: './txandak.page.html',
  styleUrls: ['./txandak.page.scss'],
})
export class TxandakPage implements OnInit {
  harrera: any[] = [];
  garbiketa: any[] = [];
  txandak: any[] = [];
  currentSection: 'harrera' | 'garbiketa' = 'harrera';
  fechaInicio: string = '';
  fechaFin: string = '';
  langileak: any[] = [];

  newTxandak = {
    mota: '',
    data: new Date().toISOString().split('T')[0],
    id_langilea: null
  };

  isModalOpen = false; // Controla la apertura del modal

  constructor(private hitzorduakService: HitzorduakService, 
              private alertController: AlertController, 
              private modalController: ModalController) {}

  ngOnInit() {
    this.loadTxandak();
  }

  segmentChanged() {
    console.log('Sección actual:', this.currentSection);
  }

  isAdmin(): boolean{
    return this.hitzorduakService.hasRole('IR');
  }

  loadTxandak(): void {
    this.hitzorduakService.getAllTxandak().subscribe(
      (data) => {
        this.txandak = data.map((txandak) => ({
          id: txandak.id,
          mota: txandak.mota,
          data: txandak.data,
          langilea: txandak.langilea ? {
            id: txandak.langilea.id,
            izena: txandak.langilea.izena,
            abizena: txandak.langilea.abizena
          } : null
        }));

        this.harrera = this.txandak.filter(item => item.mota === 'M');
        this.garbiketa = this.txandak.filter(item => item.mota === 'G');
      },
      (error) => {
        console.error('Error al cargar txandak:', error);
      }
    );
  }

  loadLangileak(): void {
    this.hitzorduakService.getLangileak().subscribe(
      (data) => {
        this.langileak = data.map((langileak) => ({
          id: langileak.id,
          name: langileak.izena,
          abizena: langileak.abizenak,
          taldeak: langileak.taldeak ? {
            kodea: langileak.taldeak.kodea,
          } : null
        }));
      },
      (error) => {
        console.error('Error al cargar grupos:', error);
      }
    );
  }

  openAddItemModal(): void {
    this.isModalOpen = true;
    this.loadLangileak();
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveTxanda(): void {
    if (!this.newTxandak.mota || !this.newTxandak.data || !this.newTxandak.id_langilea) {
      console.log('Datos incompletos');
      return; // Evita el cierre si los datos están incompletos
    }

    const nuevoTxanda = {
      mota: this.newTxandak.mota,
      data: this.newTxandak.data,
      langilea: this.newTxandak.id_langilea ? { id: this.newTxandak.id_langilea } : null,
    };

    this.hitzorduakService.createTxandak(nuevoTxanda).subscribe(
      () => {
        this.loadTxandak();
        this.closeModal(); // Cierra el modal después de guardar
      },
      (error) => console.error('Error al crear txanda:', error)
    );
  }


  
  filterbyDate(): void {
    let filtered = this.txandak;
  
    if (this.fechaInicio) {
      filtered = filtered.filter(item => item.data >= this.fechaInicio);
    }
    if (this.fechaFin) {
      filtered = filtered.filter(item => item.data <= this.fechaFin);
    }
  
    // Aplicar el filtrado correcto por 'mota'
    this.harrera = filtered.filter(item => item.mota === 'M');
    this.garbiketa = filtered.filter(item => item.mota === 'G');
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
    this.harrera = this.txandak.filter(item => item.type === 'M');
    this.garbiketa = this.txandak.filter(item => item.type === 'G');
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
            this.hitzorduakService.deleteTxanda(itemId).subscribe(
              () => {

                this.txandak = this.txandak.filter(item => item.id !== itemId);
                
                // Filtramos de nuevo después de la eliminación
                this.harrera = this.txandak.filter(item => item.mota === 'M');
                this.garbiketa = this.txandak.filter(item => item.mota === 'G');
                
                this.filterbyDate(); // Aplicar el filtro por fecha si está activo
                
              },
              (error) => {            
                console.error('Error al eliminar el ítem:', error);
              }
            );
            
          },
        },
      ],
    }).then(alert => alert.present());
  }
}
