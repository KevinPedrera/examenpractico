import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
@Component({selector:'app-root',standalone:true,imports:[RouterLink,RouterOutlet],template:`<header><a routerLink="/" class="logo">CineMet</a><nav>@if(auth.usuario){<span>{{auth.usuario.nombre}}</span><a routerLink="/peliculas">Peliculas</a><a routerLink="/maratones">Maratones</a><button (click)="auth.salir()">Cerrar sesion</button>}@else{<a routerLink="/">Inicio</a><a routerLink="/desarrollador">Desarrollador</a><a routerLink="/login">Login</a>}</nav></header><main><router-outlet/></main>`}) export class AppComponent {auth=inject(AuthService);}
