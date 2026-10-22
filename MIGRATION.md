# Lista de migracion

## Preparado en este repositorio

- Codigo fuente exportado del proyecto actual.
- Dependencias exclusivas de Lovable retiradas.
- Imagenes y videos reales incluidos en `public/__l5e/assets-v1`.
- Variables privadas excluidas de Git mediante `.gitignore`.
- Rutas SPA y cache de archivos configurados para Vercel.
- Migraciones de base de datos conservadas en `drizzle/migrations`.

## Antes de retirar Lovable

1. Crear un repositorio privado de GitHub y subir la rama `main`.
2. Importar el repositorio en Vercel y configurar las variables del frontend.
3. Probar paginas, formularios, login, panel, edicion de textos, colores y medios.
4. Confirmar quien controla el proyecto Supabase actual.
5. Si ese backend depende de Lovable, crear un Supabase propio y migrar tablas, usuarios y Storage.
6. Actualizar en Vercel las variables al nuevo Supabase y repetir las pruebas.
7. Conectar el dominio a Vercel.
8. Mantener Lovable activo hasta verificar el sitio final y la recuperacion de datos.

## Alcance

Este repositorio permite separar el codigo y el alojamiento web de Lovable. La salida completa solo termina cuando el backend tambien esta bajo una cuenta independiente y existe una copia de seguridad verificable.
