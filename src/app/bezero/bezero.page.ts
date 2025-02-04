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
  visits: Visit[];
  firstVisit: string;
  lastVisit: string;
}

@Component({
  selector: 'app-bezero',
  templateUrl: './bezero.page.html',
  styleUrls: ['./bezero.page.scss'],
})
export class BezeroPage implements OnInit {
  searchQuery: string = '';
  clients: Client[] = [];
  filteredClients: Client[] = [];
  selectedClient: Client | null = null;

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
            sensitiveSkin: client.azal_sentikorra === 'Y',
            visits: client.visits || [],
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
  }

  closeModal(): void {
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
