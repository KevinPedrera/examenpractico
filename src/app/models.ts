export interface Usuario { id: string; nombre: string; email: string; password: string; }
export interface Pelicula { id: string; titulo: string; genero: string; duracion: number; anio: number; }
export interface Maraton { id: string; nombre: string; peliculas: Record<string, {titulo: string; duracion: number}>; }
