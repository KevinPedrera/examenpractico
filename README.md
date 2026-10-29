# CineMet - Caso practico Angular

Aplicacion Angular standalone para gestionar maratones de peliculas.

## Ejecutar

1. Instalar Node.js y ejecutar `npm install`.
2. Configurar `src/environments/firebase.config.ts` con los datos de tu proyecto Firebase y habilitar **Realtime Database**.
3. Terminal 1: `npm run api` (json-server en http://localhost:3000).
4. Terminal 2: `npm start` (Angular en http://localhost:4200).

## Usuarios de prueba

- ana@cinemet.com / 123456
- luis@cinemet.com / 123456

## Importante

Firebase **no** esta configurado en el repositorio: debes colocar tus propias credenciales publicas del SDK web y configurar reglas de acceso apropiadas. El ejemplo de login contra json-server es solo academico: las contrasenas en db.json son texto plano y la sesion local no constituye autenticacion segura de Firebase. Para una implementacion real con aislamiento de datos, utilizar Firebase Authentication y reglas de seguridad por uid. No publicar informacion real de usuarios.
