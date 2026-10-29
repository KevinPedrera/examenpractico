import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { InicioComponent, DesarrolladorComponent, LoginComponent, PeliculasComponent, MaratonesComponent } from './pages';
export const routes:Routes=[{path:'',component:InicioComponent},{path:'desarrollador',component:DesarrolladorComponent},{path:'login',component:LoginComponent},{path:'peliculas',component:PeliculasComponent,canActivate:[authGuard]},{path:'maratones',component:MaratonesComponent,canActivate:[authGuard]},{path:'**',redirectTo:''}];
