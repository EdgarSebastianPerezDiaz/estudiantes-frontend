import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
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

  // Listar proyectos pendientes (admin)
  pendientes(): Observable<Proyecto[]> {
    // Reemplaza con llamada real si tienes endpoint, aquí simulado:
    return this.http.get<Proyecto[]>(`${BASE_API_URL}/admin/proyectos-pendientes`);
  }

  // Aprobar proyecto (admin)
  aprobar(id: string): Observable<any> {
    // Reemplaza con llamada real si tienes endpoint, aquí simulado:
    return this.http.put(`${BASE_API_URL}/admin/proyectos/${id}/estado`, { estado: 'aprobado' });
  }

  // Rechazar proyecto (admin)
  rechazar(id: string): Observable<any> {
    // Reemplaza con llamada real si tienes endpoint, aquí simulado:
    return this.http.put(`${BASE_API_URL}/admin/proyectos/${id}/estado`, { estado: 'rechazado' });
  }

  // Registrar descarga
  registrarDescarga(id: string): Observable<any> {
    return this.http.post(`${BASE_API_URL}/proyectos/${id}/download`, {});
  }

  // Listar proyectos (simulado para fallback)
  listar(): Observable<Proyecto[]> {
    return this.getProyectos();
  }

  // Listar semilla (simulado para fallback)
  listarSeed(): Observable<{ proyectos: Proyecto[]; materias: any[] }> {
    // Simulación, reemplaza con endpoint real si existe
    return of({ proyectos: [], materias: [] }).pipe(delay(100));
  }

  // Crear proyecto (simulado para fallback)
  crear(body: Partial<Proyecto>): Observable<Proyecto> {
    return this.crearProyecto(body);
  }
}
