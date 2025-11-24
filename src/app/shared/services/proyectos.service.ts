import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_API_URL } from '../../core/config/api.config';

export interface Proyecto {
  id: number | string;
  titulo: string;
  descripcion: string;
  estado: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class ProyectosService {
  constructor(private http: HttpClient) {}

  getProyectos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${BASE_API_URL}/proyectos`);
  }

  crearProyecto(body: Partial<Proyecto>): Observable<Proyecto> {
    return this.http.post<Proyecto>(`${BASE_API_URL}/proyectos`, body);
  }

  getProyecto(id: number | string): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${BASE_API_URL}/proyectos/${id}`);
  }

  actualizarProyecto(id: number | string, body: Partial<Proyecto>): Observable<Proyecto> {
    return this.http.put<Proyecto>(`${BASE_API_URL}/proyectos/${id}`, body);
  }

  eliminarProyecto(id: number | string): Observable<void> {
    return this.http.delete<void>(`${BASE_API_URL}/proyectos/${id}`);
  }

  descargarProyecto(id: number | string): Observable<Blob> {
    return this.http.post(`${BASE_API_URL}/proyectos/${id}/download`, {}, { responseType: 'blob' });
  }
}
