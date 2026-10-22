# Todo Clean Peru

Sitio web y panel administrativo de Todo Clean Peru, preparado para funcionar fuera de Lovable y desplegarse desde GitHub en Vercel.

## Desarrollo local

1. Instala las dependencias con `npm install`.
2. Copia `.env.example` como `.env` y completa las tres variables `VITE_SUPABASE_*`.
3. Inicia el proyecto con `npm run dev`.
4. Genera la version de produccion con `npm run build`.

## Despliegue en Vercel

1. Sube esta carpeta a un repositorio privado de GitHub.
2. Importa el repositorio en Vercel como proyecto Vite.
3. Configura en Vercel las variables `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` y `VITE_SUPABASE_PROJECT_ID` para Production, Preview y Development.
4. Usa `npm run build` como Build Command y `dist` como Output Directory.
5. Verifica el sitio publico, el acceso a `/admin` y la carga y edicion de contenido antes de cambiar el dominio.

`vercel.json` contiene la regla necesaria para que las rutas internas de React funcionen al abrirse directamente.

## Base de datos y archivos

El frontend sigue usando el proyecto Supabase indicado por las variables de entorno. Las migraciones SQL estan en `drizzle/migrations` y los archivos que anteriormente dependian del CDN de Lovable estan incluidos en `public/__l5e/assets-v1`.

Para ejecutar migraciones fuera de Lovable, define `DATABASE_URL` localmente y usa Drizzle. Nunca publiques esa variable ni una clave de servicio en GitHub o en variables accesibles al navegador.

## Retiro de Lovable

No elimines el proyecto de Lovable hasta comprobar estos puntos:

- El repositorio de GitHub contiene el codigo y los archivos reales.
- El despliegue de Vercel funciona en todas las rutas y en el panel administrativo.
- El dominio apunta correctamente a Vercel.
- La base de datos, autenticacion y Storage de Supabase son propiedad del cliente o fueron migrados a un proyecto independiente.
- Existe una copia de seguridad de las tablas y de los archivos de Storage.

Vercel y GitHub conservan el frontend, pero no reemplazan automaticamente la base de datos, los usuarios ni Storage.
