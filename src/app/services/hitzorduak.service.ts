import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HitzorduakService {
  private apiUrl = 'http://localhost:8090/api';

  constructor(private http: HttpClient) {}

  // Obtener todos los servicios
  getZerbitzuak(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/zerbitzuak`);
  }

  // Obtener todas las citas
  getHitzorduak(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/hitzorduak`);
  }

  // Obtener todos los materiales
  getMaterialak(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/materialak`);
  }

  // Obtener todos los productos
  getProduktuak(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produktuak`);
  }

  // Crear un nuevo material
  createMaterialak(material: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/materialak`, material);
  }

  // Crear un nuevo producto
  createProduktuak(producto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/produktuak`, producto);
  }

  // Eliminar un material
  deleteMaterialak(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/materialak/${id}`);
  }

  // Eliminar un producto
  deleteProduktuak(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/produktuak/${id}`);
  }

  // Actualizar un material
  updateMaterialak(id: number, material: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/materialak/${id}`, material);
  }

  // Actualizar un producto
  updateProduktuak(id: number, producto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/produktuak/${id}`, producto);
  }

}
