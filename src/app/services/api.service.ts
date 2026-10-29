import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pelicula, Usuario } from '../models';
@Injectable({providedIn:'root'}) export class ApiService {
 private http = inject(HttpClient);
 private api = 'http://localhost:3000';
 usuarios(): Observable<Usuario[]> { return this.http.get<Usuario[]>(this.api+'/usuarios'); }
 peliculas(): Observable<Pelicula[]> { return this.http.get<Pelicula[]>(this.api+'/peliculas'); }
}
