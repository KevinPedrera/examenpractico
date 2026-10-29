import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { MaratonesService } from './services/maratones.service';
import { Maraton, Pelicula } from './models';

@Component({standalone:true,imports:[RouterLink],template:`<h1>Bienvenido a CineMet</h1><p>Organiza tus peliculas en maratones.</p><div class="row"><a class="btn" routerLink="/login">Iniciar sesion</a><a class="btn" routerLink="/desarrollador">Desarrollador</a></div>`})
export class InicioComponent {}

@Component({standalone:true,template:`<h1>Desarrollador</h1><p>Nombre: Kevin Pedrera</p><p>Correo institucional: completar con tu correo institucional</p>`})
export class DesarrolladorComponent {}

@Component({standalone:true,imports:[FormsModule],template:`<h1>Iniciar sesion</h1><form (ngSubmit)="entrar()"><label>Correo electronico</label><input type="email" name="email" [(ngModel)]="email" required><label>Contrasena</label><input type="password" name="password" [(ngModel)]="password" required><p><button type="submit">Ingresar</button></p></form>@if(error){<p class="error">{{error}}</p>}`})
export class LoginComponent {
 private auth=inject(AuthService);private router=inject(Router);
 email='';password='';error='';
 entrar(){this.error='';this.auth.login(this.email,this.password).subscribe({next:ok=>ok?this.router.navigate(['/peliculas']):this.error='Credenciales incorrectas',error:()=>this.error='No se pudo conectar con json-server'});}
}

@Component({standalone:true,imports:[CommonModule,FormsModule,RouterLink],template:`
<h1>Catalogo de peliculas</h1><label>Filtrar por genero</label><select [(ngModel)]="genero"><option value="">Todos</option>@for(g of generos;track g){<option [value]="g">{{g}}</option>}</select>
@if(error){<p class="error">{{error}}</p>}
<div class="grid">@for(p of filtradas;track p.id){<div class="card"><h2>{{p.titulo}}</h2><p>{{p.genero}} | {{p.anio}}</p><p>{{p.duracion}} minutos</p>@if(p.duracion>150){<p class="info">Larga duracion</p>}<button (click)="seleccionar(p)">Agregar a maraton</button></div>}</div>
@if(seleccionada){<div class="modal-bg"><div class="modal"><h2>Agregar {{seleccionada.titulo}}</h2>
@if(maratones.length===0){<p>No tienes maratones creadas.</p><a routerLink="/maratones">Ir a Maratones</a>}
@else{@for(m of maratones;track m.id){<div class="row"><span>{{m.nombre}}</span><button (click)="agregar(m)">Agregar</button></div>}}
@if(aviso){<p class="info">{{aviso}}</p>}<button (click)="seleccionada=null">Cancelar</button></div></div>}
`})
export class PeliculasComponent implements OnInit {
 private api=inject(ApiService);private servicio=inject(MaratonesService);private auth=inject(AuthService);
 peliculas:Pelicula[]=[];maratones:Maraton[]=[];genero='';seleccionada:Pelicula|null=null;aviso='';error='';
 get generos(){return [...new Set(this.peliculas.map(p=>p.genero))];}
 get filtradas(){return this.genero?this.peliculas.filter(p=>p.genero===this.genero):this.peliculas;}
 ngOnInit(){this.api.peliculas().subscribe({next:p=>this.peliculas=p,error:()=>this.error='No se pudo cargar el catalogo'});}
 async seleccionar(p:Pelicula){this.seleccionada=p;this.aviso='';try{this.maratones=await this.servicio.listar(this.auth.usuario!.id);}catch{this.aviso='Error al consultar Firebase. Revisa la configuracion.';}}
 async agregar(m:Maraton){if(!this.seleccionada)return;try{const ok=await this.servicio.agregar(this.auth.usuario!.id,m.id,this.seleccionada);this.aviso=ok?'Pelicula agregada':'Esta pelicula ya esta en esta maraton';}catch{this.aviso='Error al guardar en Firebase';}}
}

@Component({standalone:true,imports:[CommonModule,FormsModule],template:`
<h1>Mis maratones</h1><div class="row"><input [(ngModel)]="nombre" placeholder="Nombre de la maraton"><button (click)="crear()">Crear maraton</button></div>
@if(aviso){<p class="info">{{aviso}}</p>}
@for(m of maratones;track m.id){<div class="card row"><div><h2>{{m.nombre}}</h2><p>{{cantidad(m)}} peliculas</p></div><button (click)="actual=m">Ver maraton</button></div>}
@if(actual){<div class="modal-bg"><div class="modal"><h2>{{actual.nombre}}</h2>
@if(cantidad(actual)===0){<p>Esta maraton aun no tiene peliculas</p>}
@for(p of entradas(actual);track p.id){<div class="row"><span>{{p.titulo}} - {{p.duracion}} min</span><button (click)="quitar(p.id)">Quitar</button></div>}
<h3>Tiempo total: {{tiempo(actual)}}</h3><button (click)="actual=null">Cerrar</button></div></div>}
`})
export class MaratonesComponent implements OnInit {
 private servicio=inject(MaratonesService);private auth=inject(AuthService);
 nombre='';aviso='';maratones:Maraton[]=[];actual:Maraton|null=null;
 ngOnInit(){this.cargar();}
 async cargar(){try{this.maratones=await this.servicio.listar(this.auth.usuario!.id);if(this.actual)this.actual=this.maratones.find(m=>m.id===this.actual!.id)||null;}catch{this.aviso='Error al cargar Firebase. Revisa la configuracion.';}}
 async crear(){if(!this.nombre.trim()){this.aviso='El nombre es obligatorio';return;}try{await this.servicio.crear(this.auth.usuario!.id,this.nombre.trim());this.nombre='';this.aviso='Maraton creada';await this.cargar();}catch{this.aviso='No se pudo crear la maraton';}}
 entradas(m:Maraton){return Object.entries(m.peliculas||{}).map(([id,p])=>({id,...p}));}
 cantidad(m:Maraton){return this.entradas(m).length;}
 tiempo(m:Maraton){const t=this.entradas(m).reduce((a,p)=>a+p.duracion,0);return String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');}
 async quitar(id:string){if(!this.actual)return;try{await this.servicio.quitar(this.auth.usuario!.id,this.actual.id,id);await this.cargar();}catch{this.aviso='No se pudo quitar la pelicula';}}
}
