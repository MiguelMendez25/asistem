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

La exportación institucional usa la plantilla XLSX v3 (`_Asistem!B1 = 3`). La fila 8 contiene 35 asignaturas editables en C8:AK8; los estudiantes pasan a las filas 9–46, con asistencias en C9:AK46 e identificadores en AL. La leyenda de asignaturas se imprime al final. Las abreviaciones y sus nombres completos se obtienen exclusivamente del catálogo de `modelo.js`; ambos se admiten al importar. Las materias vacías significan Sin asignar.

La importación conserva v1 y v2 (estudiantes en filas 8–45, sin asignaturas). Símbolos v2/v3: `.` asistió, `E` con excusa, `X` sin excusa, `A` reportado y `R` tarde. En v1 se utiliza exclusivamente `A`, `CE`, `SE`, `R`, `T`, respectivamente. No se deduce la versión de las letras ni de la leyenda. Una celda de asistencia vacía siempre significa Sin registrar.

El modelo/borrador sigue en v1 con un campo opcional `asignaturas[fecha][hora]` que almacena el identificador de la materia. Los borradores anteriores sin ese campo son válidos y se interpretan sin asignaturas; no se cambian sus marcaciones. Toda modificación de materia incrementa la revisión de su semana para el aviso de cambios pendientes de Excel.

Las filas 3 y 6 son técnicas y están ocultas. El papel inicial A4 se centraliza en `PAPEL_EXCEL` de `excel.js`; se ajusta a una página de ancho y se permite más de una de alto para evitar reducir el texto en exceso. Los encabezados, incluida la fila de asignaturas, se repiten si hay varias páginas.
