# SheetJS Community Edition

Versión: 0.20.3. Script independiente oficial, sin modificaciones.

Origen: https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js

Licencia Apache 2.0: `LICENSE-SheetJS.txt`, obtenida de https://cdn.sheetjs.com/xlsx-0.20.3/package/LICENSE

SHA-256 del script: `cc015130aa8521e7f088f88898eba949ccdcbfb38df0bd129b44b7273c3a6f41`.

La página carga esta copia local; no consulta el CDN durante su uso.

## ExcelJS

Versión fija: **4.4.0**, distribución de navegador del paquete oficial `exceljs`, sin modificaciones.

- Script: https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js
- Licencia MIT: `LICENSE-ExcelJS.txt`, obtenida de https://cdn.jsdelivr.net/npm/exceljs@4.4.0/LICENSE
- Repositorio y documentación: https://github.com/exceljs/exceljs/tree/v4.4.0
- SHA-256: `7e49da68588e250dbb8bba190d2caa8ab3787cc0284bda1d8b2f805c4df742c9`.

ExcelJS genera estilos e impresión; SheetJS sigue leyendo y validando las fichas. Ambos scripts se cargan localmente, sin red durante el uso.

La exportación institucional usa la plantilla XLSX v2 (`_Asistem!B1 = 2`), conservando las posiciones de datos y el modelo/borrador v1. Símbolos v2: `.` asistió, `E` con excusa, `X` sin excusa, `A` reportado y `R` tarde. La importación de archivos v1 mantiene exclusivamente la codificación antigua: `A`, `CE`, `SE`, `R`, `T`, respectivamente. No se deduce la versión de las letras ni de la leyenda. Una celda vacía siempre significa sin registrar.

Las filas 3 y 6 son técnicas y están ocultas; las asistencias permanecen en C8:AK45. El papel inicial A4 se centraliza en `PAPEL_EXCEL` de `excel.js`; se ajusta a una página de ancho y se permite más de una de alto para evitar reducir el texto en exceso. Los encabezados se repiten si hay varias páginas.
