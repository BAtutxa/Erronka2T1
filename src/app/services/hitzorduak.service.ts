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
}
