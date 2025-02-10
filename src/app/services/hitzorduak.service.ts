import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HitzorduakService {
  
  getLangileakByGroup(kodea: any) {
    throw new Error('Method not implemented.');
  }
  
  
  
  private apiUrl = 'http://localhost:8090/api';

  constructor(private http: HttpClient) {}

  // Obtener todos los servicios
  getZerbitzuak(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/zerbitzuak`);
  }

  getKoloreakByGroup(BezeroId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/taldeak/${BezeroId}/kolore-historialak`);
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
  
  getAllBezeroFitxak(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bezero-fitxak`);
  }

  getGroups(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/taldeak`);
  }

  // Añadir un nuevo grupo
  addGroup(group: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/taldeak`, group);
  }

  // Eliminar un grupo
  deleteGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/taldeak/${id}`);
  }

  // Obtener personas de un grupo específico
  getPersonsByGroup(groupId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/taldeak/${groupId}/langileak`);
  }

  // Añadir una persona a un grupo
  addPersonToGroup(groupId: number, person: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/grupos/${groupId}/langileak`, person);
  }

  // Eliminar una persona de un grupo
  deletePersonFromGroup(groupId: number, personId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/grupos/${groupId}/langileak/${personId}`);
  }

  getLangileak(): Observable<any[]>  {
    return this.http.get<any[]>(`${this.apiUrl}/langileak`);
  }

  deleteLangile(personId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/langileak/${personId}`);
  }

  updateGroup(id: number, selectedItem: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/taldeak/${id}`, selectedItem);
  }

  updateLangile(id: any, selectedItem: any) {
    return this.http.put<any>(`${this.apiUrl}/langileak/${id}`, selectedItem);  }

  getGroupByKodea(kodea: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/taldeak/${kodea}`);
  }
    
}
