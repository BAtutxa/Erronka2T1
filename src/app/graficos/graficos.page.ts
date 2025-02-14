import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HitzorduakService } from '../services/hitzorduak.service';
import Chart from 'chart.js/auto';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
})
export class GraficosPage implements OnInit {
  @ViewChild('productosChart') productosChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('productosPieChart') productosPieChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('productosLineChart') productosLineChart?: ElementRef<HTMLCanvasElement>;


  produktuak: any[] = [];


  constructor(private hitzorduakService: HitzorduakService) {}


  ngOnInit(): void {
    this.loadProduktuak();
  }


  loadProduktuak(): void {
    this.hitzorduakService.getProduktuak().subscribe(
      (data) => {
        this.produktuak = data.map((produktu) => ({
          id: produktu.id,
          name: produktu.izena,
          stock: produktu.stock || 0,
        }));


        this.renderCharts();
      },
      (error) => {
        console.error('Error al cargar productos:', error);
      }
    );
  }


  renderCharts(): void {
    this.renderBarChart();
    this.renderPieChart();
    this.renderLineChart();
  }


  renderBarChart(): void {
    if (this.productosChart?.nativeElement) {
      const ctx = this.productosChart.nativeElement.getContext('2d');
      if (!ctx) return;


      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.produktuak.map(p => p.name),
          datasets: [{
            label: 'Stock de Productos',
            data: this.produktuak.map(p => p.stock),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: { responsive: true }
      });
    }
  }


  renderPieChart(): void {
    if (this.productosPieChart?.nativeElement) {
      const ctx = this.productosPieChart.nativeElement.getContext('2d');
      if (!ctx) return;


      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.produktuak.map(p => p.name),
          datasets: [{
            label: 'Stock de Productos',
            data: this.produktuak.map(p => p.stock),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#9966FF']
          }]
        },
        options: { responsive: true }
      });
    }
  }


  renderLineChart(): void {
    if (this.productosLineChart?.nativeElement) {
      const ctx = this.productosLineChart.nativeElement.getContext('2d');
      if (!ctx) return;


      new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.produktuak.map(p => p.name),
          datasets: [{
            label: 'Evolución de Stock',
            data: this.produktuak.map(p => p.stock),
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false
          }]
        },
        options: { responsive: true }
      });
    }
  }


  async exportToPDF(): Promise<void> {
    const doc = new jsPDF('p', 'mm', 'a4'); 
    let yPos = 10; 
 
    const chartWidth = 180;
    const chartHeight = 80;
 
    const addCanvasToPDF = async (canvasElement: ElementRef<HTMLCanvasElement>) => {
      if (canvasElement?.nativeElement) {
        const canvas = await html2canvas(canvasElement.nativeElement, { scale: 2 }); 
        const imgData = canvas.toDataURL('image/png');
 
        doc.addImage(imgData, 'PNG', 15, yPos, chartWidth, chartHeight);
 
        yPos += chartHeight + 10;
 
        if (yPos > 260) {
          doc.addPage();
          yPos = 10; 
        }
      }
    };
 
    await addCanvasToPDF(this.productosChart!);
    await addCanvasToPDF(this.productosPieChart!);
    await addCanvasToPDF(this.productosLineChart!);
 
    doc.save('graficos_productos.pdf');
  }
}
