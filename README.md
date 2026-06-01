# Plan interactivo Ingeniería Electrónica UNPSJB

Sitio estático listo para Vercel.

## Cómo subirlo a Vercel

1. Descomprimir este ZIP.
2. Subir la carpeta a un repositorio de GitHub, GitLab o Bitbucket.
3. En Vercel: **Add New Project** → importar el repositorio.
4. Framework Preset: **Other** o dejar autodetección.
5. Build Command: vacío.
6. Output Directory: vacío o `.`.
7. Deploy.

## Cómo editar materias

Modificar `data.js`. Cada asignatura tiene:

- `year`: año
- `term`: cuatrimestre
- `weekly`: horas semanales
- `hours`: horas totales
- `block`: bloque/color
- `contents`: contenidos mínimos

