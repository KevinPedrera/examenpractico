import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { ApiService } from './api.service';
import { Usuario } from '../models';
@Injectable({providedIn:'root'}) export class AuthService {
 private api=inject(ApiService); private router=inject(Router);
 usuario: Usuario|null = this.recuperar();
 private recuperar(): Usuario|null { try { return JSON.parse(sessionStorage.getItem('usuario')||'null'); } catch { return null; } }
 login(email:string,password:string) { return this.api.usuarios().pipe(map(usuarios=>{const u=usuarios.find(x=>x.email===email && x.password===password); if(u){this.usuario=u;sessionStorage.setItem('usuario',JSON.stringify(u));} return !!u;})); }
 salir(){this.usuario=null;sessionStorage.removeItem('usuario');this.router.navigate(['/login']);}
}
