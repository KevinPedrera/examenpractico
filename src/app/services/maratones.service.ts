import { Injectable } from '@angular/core';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, get, push, set, remove } from 'firebase/database';
import { firebaseConfig } from '../../environments/firebase.config';
import { Maraton, Pelicula } from '../models';
const app=getApps().length ? getApp() : initializeApp(firebaseConfig);
const db=getDatabase(app);
@Injectable({providedIn:'root'}) export class MaratonesService {
 private ruta(uid:string){return 'maratones/'+uid;}
 async listar(uid:string):Promise<Maraton[]>{const s=await get(ref(db,this.ruta(uid))); const obj=s.val()||{};return Object.entries(obj).map(([id,v])=>({id,nombre:(v as any).nombre,peliculas:(v as any).peliculas||{}}));}
 async crear(uid:string,nombre:string){const r=push(ref(db,this.ruta(uid)));await set(r,{nombre,peliculas:{}});}
 async agregar(uid:string,id:string,p:Pelicula){const r=ref(db,`${this.ruta(uid)}/${id}/peliculas/${p.id}`);if((await get(r)).exists())return false;await set(r,{titulo:p.titulo,duracion:p.duracion});return true;}
 async quitar(uid:string,id:string,pid:string){await remove(ref(db,`${this.ruta(uid)}/${id}/peliculas/${pid}`));}
}
