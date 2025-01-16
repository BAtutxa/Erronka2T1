import { Component, OnInit } from '@angular/core';

interface Visit {
  visitDate: string;
  service: string;
}

interface Client {
  name: string;
  visits: Visit[];
  lastVisit?: Visit | null;
}

@Component({
  selector: 'app-bezero',
  templateUrl: './bezero.page.html',
  styleUrls: ['./bezero.page.scss'],
})
export class BezeroPage implements OnInit {
  searchQuery: string = '';
  clients: Client[] = [
    {
      name: 'Ana López',
      visits: [
        { visitDate: '2025-01-10', service: 'Corte de cabello' },
        { visitDate: '2025-01-05', service: 'Tinte completo' },
      ],
    },
    {
      name: 'Juan Pérez',
      visits: [
        { visitDate: '2025-01-08', service: 'Tinte completo' },
        { visitDate: '2025-01-02', service: 'Corte de cabello' },
      ],
    },
    {
      name: 'Marta Ruiz',
      visits: [
        { visitDate: '2025-01-05', service: 'Peinado especial' },
        { visitDate: '2025-01-01', service: 'Corte de cabello' },
      ],
    },
  ];
  filteredClients: Client[] = [];
  selectedClient: Client | null = null;

  ngOnInit() {
    this.filterClients(); // Inicializar la lista filtrada
  }

  filterClients(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredClients = this.clients
      .map(client => ({
        ...client,
        lastVisit: client.visits.length
          ? client.visits.reduce((latest, current) =>
              new Date(latest.visitDate) > new Date(current.visitDate) ? latest : current
            )
          : null,
      }))
      .filter(client => client.name.toLowerCase().includes(query))
      .sort((a, b) =>
        b.lastVisit && a.lastVisit
          ? new Date(b.lastVisit.visitDate).getTime() - new Date(a.lastVisit.visitDate).getTime()
          : 0
      );
  }

  selectClient(client: Client): void {
    this.selectedClient = client;
  }

  closeModal(): void {
    this.selectedClient = null;
  }
}
