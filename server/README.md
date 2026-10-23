# Servidor local de Asistem

Esta tarea prepara únicamente el servidor HTTP y una base SQLite vacía. El frontend sigue funcionando como antes y todavía no se comunica con el servidor. No se guardan asistencias.

## Archivos

- `../package.json`: comando de inicio y requisito de Node.js 24, sin dependencias externas.
- `index.js`: servidor HTTP, validación del puerto, mensajes de inicio y cierre.
- `database.js`: creación del directorio local y apertura de SQLite mediante `node:sqlite`.
- `data/asistem.sqlite`: base local generada al arrancar; no contiene tablas ni registros y queda excluida de Git.
- `../.gitignore`: excluye datos locales, bases y auxiliares de SQLite, dependencias, configuración privada, logs y temporales.

La ruta de datos se calcula respecto de `database.js`, no respecto de la ubicación de la terminal. Una base existente se abre sin borrarla ni reinicializarla.

## Iniciar desde PowerShell

Abre PowerShell en la raíz del proyecto, donde están `Index.html` y `package.json`:

```powershell
node --version
npm.cmd --version
npm.cmd start
```

La instalación de referencia es Node.js 24.22.1 con npm 11.19.1. No necesitas ejecutar `npm install`: se usan únicamente módulos integrados de Node.js. Usa `npm.cmd` para evitar el bloqueo de `npm.ps1`, sin cambiar la política de ejecución de Windows.

Si la terminal no encuentra estos comandos o selecciona otra instalación, puedes usar la instalación de Windows por su ruta:

```powershell
& 'C:\Program Files\nodejs\node.exe' --version
& 'C:\Program Files\nodejs\npm.cmd' --version
& 'C:\Program Files\nodejs\node.exe' .\server\index.js
```

El servidor escucha en `0.0.0.0`, puerto `3000` por defecto. Deja esa terminal abierta mientras lo utilizas. Para detenerlo, pulsa **Ctrl+C**. Si `npm.cmd` pregunta si deseas terminar el trabajo por lotes, responde `S` (o `Y` si la pregunta aparece en inglés).

Para elegir otro puerto, configura `PORT` en la misma terminal antes de iniciar:

```powershell
$env:PORT = '3001'
npm.cmd start
```

Para volver al valor predeterminado, después de detener el servidor:

```powershell
Remove-Item Env:PORT -ErrorAction SilentlyContinue
npm.cmd start
```

Solo se admiten números enteros entre 1 y 65535. Un puerto ocupado, un valor inválido o un fallo al abrir SQLite producen un mensaje en la terminal y una salida con código de error.

## Probar desde otra terminal de PowerShell

Con el servidor en ejecución:

```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/health' -Method Get
curl.exe -i http://localhost:3000/health
curl.exe -i http://localhost:3000/no-existe
```

`GET /health` debe responder con HTTP 200, tipo `application/json` y el cuerpo:

```json
{"status":"ok","service":"asistem"}
```

La ruta desconocida debe responder con HTTP 404 y `{"error":"Ruta no encontrada"}`. También devuelven 404 la raíz `/`, los archivos del frontend y los métodos distintos de GET: esta tarea no los sirve ni implementa otros endpoints.

Si cambiaste el puerto, sustituye `3000` en las direcciones de prueba.

## Comprobar SQLite y Git

Desde la raíz del proyecto, después del primer inicio:

```powershell
Get-Item .\server\data\asistem.sqlite
node -e "const { DatabaseSync } = require('node:sqlite'); const db = new DatabaseSync('server/data/asistem.sqlite', { readOnly: true }); console.log(db.prepare('PRAGMA integrity_check').all()); console.log(db.prepare('SELECT name, type FROM sqlite_schema').all()); db.close();"
git check-ignore -v server/data/asistem.sqlite server/data/asistem.sqlite-wal server/data/asistem.sqlite-shm server/data/asistem.sqlite-journal
git status --short
```

La integridad debe ser `ok` y la lista de objetos debe estar vacía (`[]`). Git debe ignorar la base y sus archivos auxiliares, pero mantener visibles los archivos fuente nuevos. `.gitignore` no protege archivos que ya se hubieran agregado previamente a Git.

## Prueba en la red local

En el computador servidor, ejecuta `ipconfig` y localiza la dirección IPv4 de la conexión a la red local. En otro dispositivo conectado a la misma red, abre `http://IP-DEL-SERVIDOR:3000/health`, sustituyendo `IP-DEL-SERVIDOR` por esa dirección. `0.0.0.0` es la dirección de escucha, no una dirección para escribir en el navegador del otro dispositivo.

La conexión desde otro equipo depende de que la red y el firewall de Windows permitan el puerto. Esta tarea no modifica el firewall ni políticas de Windows. La prueba desde el propio servidor no confirma por sí sola la conectividad entre dispositivos.

## Alcance actual

- Base vacía, sin tablas, migraciones ni registros de asistencia.
- Sin conexión con el frontend ni cambios en su botón Guardar.
- Sin autenticación, HTTPS ni publicación en Internet; infraestructura para pruebas en la red local.
- `/health` confirma que el proceso arrancó después de abrir SQLite; no ejecuta una comprobación de integridad en cada petición.
- El acceso a SQLite es síncrono en esta etapa mínima. Referencia oficial: [node:sqlite en Node.js 24](https://nodejs.org/docs/latest-v24.x/api/sqlite.html).
