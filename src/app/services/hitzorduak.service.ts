import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HitzorduakService {
   
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  private userRole: string | null = null;

  getZerbitzuak(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/zerbitzuak`);
  }

  getKoloreakByBezeroa(idBezeroa: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/kolore-historialak/bezero/${idBezeroa}`);
  }

  getKoloreak(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/kolore-historialak`);
  }

  getHitzorduak(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/hitzorduak`);
  }

  getMaterialak(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/materialak`);
  }

  getProduktuak(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produktuak`);
  }

  deleteMaterialak(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/materialak/${id}`);
  }

  deleteProduktuak(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/produktuak/${id}`);
  }

  deleteKategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/kategoriak/${id}`);
  }

  updateProduktuak(id: number, produktu: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/produktuak/${id}`, produktu);
  }

  updateLangileak(id: number, produktu: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/langileak/${id}`, produktu);
  }

  updateMaterialak(id: number, materiala: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/materialak/${id}`, materiala);
  }

  getAllBezeroFitxak(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bezeroak`);
  }

  getGroups(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/taldeak`);
  }

  addGroup(group: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/taldeak`, group);
  }

  deleteGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/taldeak/${id}`);
  }

  addPersonToGroup(groupId: number, person: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/grupos/${groupId}/langileak`, person);
  }

  deletePersonFromGroup(groupId: number, personId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/grupos/${groupId}/langileak/${personId}`);
  }

  getLangileak(): Observable<any[]>  {
    return this.http.get<any[]>(`${this.apiUrl}/langileak`);
  }

  deleteLangile(personId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/langileak/${personId}`);
  }

  deleteTxanda(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/txandak/${itemId}`);
  }
  

  updateGroup(id: number, selectedItem: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/taldeak/${id}`, selectedItem);
  }

  updateLangile(id: any, selectedItem: any) {
    return this.http.put<any>(`${this.apiUrl}/langileak/${id}`, selectedItem);  
  }

  getAllTxandak(): Observable<any[]>  {
    return this.http.get<any[]>(`${this.apiUrl}/txandak`);
  }

  getKategoriak(): Observable<any[]>  {
    return this.http.get<any[]>(`${this.apiUrl}/kategoriak`);
  }

  createproduktu(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/produktuak`, item);
  }
  
  createMaterial(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/materialak`, item);
  }

  removePersonFromGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/produktuak/${id}`);
  }

  createTxandak(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/txandak`, item);
  }
  
  getErabiltzaileak(): Observable<any[]>  {
    return this.http.get<any[]>(`${this.apiUrl}/erabiltzaileak`);
  }

  getHitzorduakByDate(fecha: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/hitzorduak?fecha=${fecha}`);
  }
  
  createHitzordua(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/hitzorduak`, item);
  }
  
  
  // Método para establecer el rol del usuario
  setRole(role: string): void {
    this.userRole = role;
  }

  // Método para obtener el rol del usuario
  getRole(): string | null {
    return this.userRole;
  }

  // Método para verificar si el usuario tiene un rol específico
  hasRole(role: string): boolean {
    return this.userRole === role;
  }

  // Método para borrar el rol del usuario
  clearRole(): void {
    this.userRole = null;
  }
}
