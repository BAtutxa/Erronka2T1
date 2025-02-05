import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HitzorduakService } from '../services/hitzorduak.service';

interface Visit {
  visitDate: string;
  service: string;
}

interface Client {
  id: number;
  name: string;
  surname: string;
  phone: string;
  sensitiveSkin: boolean;
  firstVisit: string;
  lastVisit: string;
}

interface Kolorea {
  idBezero: number;
  idProduktu: number;
  data: string;
  kantitatea: number;
  bolumena: string;
  oharra: string;
}

@Component({
  selector: 'app-bezero',
  templateUrl: './bezero.page.html',
  styleUrls: ['./bezero.page.scss'],
})
export class BezeroPage implements OnInit {
  searchQuery: string = '';
  clients: Client[] = [];
  koloreak: Kolorea[] = [];
  filteredClients: Client[] = [];
  selectedClient: Client | null = null;
  isModalOpen: boolean = false;

  constructor(
    private alertController: AlertController,
    private hitzorduakService: HitzorduakService
  ) {}

  async ngOnInit() {
    await this.loadBezeroak();
  }

  async loadBezeroak(): Promise<void> {
    try {
      this.hitzorduakService.getAllBezeroFitxak().subscribe(
        (data) => {
          this.clients = data.map(client => ({
            id: client.id,
            name: client.izena,
            surname: client.abizena,
            phone: client.telefonoa,
            sensitiveSkin: client.azalSentikorra === 'Y',
            firstVisit: client.sortzeData,
            lastVisit: client.eguneratzeData,
          }));
          this.filteredClients = [...this.clients];
        },
        (error) => {
          console.error('Error loading clients:', error);
          this.showAlert('Error', 'No se pudieron cargar los datos');
        }
      );
    } catch (error) {
      console.error('Error:', error);
      this.showAlert('Error', 'Ocurrió un error inesperado');
    }
  }

  loadKoloreak(BezeroId: number): void {
    this.hitzorduakService.getKoloreakByGroup(BezeroId).subscribe(
      (data) => {
        this.koloreak = data.map(kolorea => ({
          idBezero: kolorea.idBezeroa,
          idProduktu: kolorea.idProduktu,
          data: kolorea.data,
          kantitatea: kolorea.kantitatea,
          bolumena: kolorea.bolumena,
          oharra: kolorea.oharra
        }));
      },
      (error) => {
        console.error('Error al cargar servicios:', error);
        this.showAlert('Error', 'No se pudieron cargar los servicios');
      }
    );
  }

  searchClients(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredClients = this.clients.filter(client =>
      client.name.toLowerCase().includes(query) || 
      client.surname.toLowerCase().includes(query) ||
      client.phone.includes(query)
    );
  }

  selectClient(client: Client): void {
    this.selectedClient = client;
    this.loadKoloreak(client.id); // Cargar los Koloreak cuando se seleccione un cliente
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedClient = null;
  }

  trackById(index: number, client: Client): number {
    return client.id;
  }

  private async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
