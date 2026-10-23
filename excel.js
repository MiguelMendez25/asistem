// Plantillas v1/v2: mismas coordenadas; la versión distingue la codificación, no el modelo.
// A/B = número/nombre, C:AK = 35 horas, AL = ID estable oculto.
// Solo las celdas visibles de Asistencia contienen marcaciones.
const VERSION_PLANTILLA = 2;
// A y R son ambiguas: este mapa se usa exclusivamente para archivos declarados v1.
const CODIGOS_EXCEL_V1 = Object.freeze({
    A: "asistio", CE: "falto-con-excusa", SE: "falto-sin-excusa", R: "reportado", T: "llego-tarde"
});

function codigosImportacion(version) {
    if (version === 1) return CODIGOS_EXCEL_V1;
    if (version === 2) return Object.fromEntries(estadosOficiales.map(e => [e.simbolo, e.valor]));
    throw new Error("_Asistem!B1: versión de archivo ausente o incompatible. Se admiten únicamente las versiones 1 y 2.");
}
const LIMITE_EXCEL = 5 * 1024 * 1024;
const DIAS_LECTIVOS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
// A4 inicial de prueba; la fotografía no determina el papel original.
const PAPEL_EXCEL = 9;
const TITULO_INSTITUCIONAL = "INSTITUCIÓN EDUCATIVA EL NACIONAL — CONTROL DE ASISTENCIA DIARIO DE ESTUDIANTES BÁSICA SECUNDARIA Y MEDIA";

function encabezadoInstitucional(lunes) {
    const viernes = sumarDias(lunes, 4);
    const anios = lunes.slice(0, 4) === viernes.slice(0, 4)
        ? lunes.slice(0, 4) : lunes.slice(0, 4) + " / " + viernes.slice(0, 4);
    return TITULO_INSTITUCIONAL + "\nAÑO: " + anios;
}

function mesesDeFicha(lunes) {
    const meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
    const primero = meses[Number(lunes.slice(5, 7)) - 1];
    const ultimo = meses[Number(sumarDias(lunes, 4).slice(5, 7)) - 1];
    return primero === ultimo ? primero : primero + " / " + ultimo;
}

function leyendaExcel() {
    return estadosOficiales.map(e => `${e.simbolo} = ${e.texto}`).join(" | ") + " | Vacía = Sin registrar";
}

function posicionesSemana(lunes) {
    return diasDeSemana(lunes).flatMap((fecha, dia) =>
        Array.from({ length: 7 }, (_, i) => ({ fecha, dia, hora: i + 1 })));
}

function codigoEnFicha(ficha, fecha, hora, id) {
    const valor = ficha.marcaciones[fecha]?.[hora]?.[id];
    return estadosOficiales.find(e => e.valor === valor)?.simbolo || "";
}

function crearLibroExcel(ficha) {
    validarBorrador({ versionFormato: VERSION_FORMATO, fichas: [ficha] });
    const posiciones = posicionesSemana(ficha.lunes);
    const filas = [
        [encabezadoInstitucional(ficha.lunes)],
        ["GRADO", ficha.curso.nombre],
        ["Lunes", ficha.lunes, "Viernes", sumarDias(ficha.lunes, 4)],
        [leyendaExcel()],
        ["", "", ...posiciones.map(p => p.hora === 1 ? DIAS_LECTIVOS[p.dia].toUpperCase() : "")],
        ["", "", ...posiciones.map(p => p.fecha)],
        ["#", "Estudiante", ...posiciones.map(p => p.hora), "ID estudiante"]
    ];
    estudiantes.forEach(e => filas.push([e.numero, e.nombre,
        ...posiciones.map(p => codigoEnFicha(ficha, p.fecha, p.hora, e.id)), e.id]));
    const libro = new ExcelJS.Workbook();
    const hoja = libro.addWorksheet("Asistencia", {
        views: [{ showGridLines: false }],
        pageSetup: {
            paperSize: PAPEL_EXCEL, orientation: "landscape", horizontalCentered: true,
            fitToPage: true, fitToWidth: 1, fitToHeight: 0,
            printArea: `A1:AK${7 + estudiantes.length}`, printTitlesRow: "1:7",
            showGridLines: false,
            margins: { left: 0.2, right: 0.2, top: 0.25, bottom: 0.25, header: 0.1, footer: 0.1 }
        }
    });
    hoja.addRows(filas);
    hoja.getColumn(1).width = 4.5;
    hoja.getColumn(2).width = 40;
    for (let c = 3; c <= 37; c++) hoja.getColumn(c).width = 2.8;
    hoja.getColumn(38).hidden = true;
    hoja.getColumn(38).width = 20;
    // Fechas originales intactas para el importador; no ocupan espacio impreso.
    hoja.getRow(3).hidden = true;
    hoja.getRow(6).hidden = true;
    hoja.mergeCells("A1:AK1");
    hoja.mergeCells("B2:E2");
    hoja.mergeCells("F2:W2");
    hoja.mergeCells("X2:AK2");
    hoja.getCell("F2").value = `SEMANA: del ${ficha.lunes} al ${sumarDias(ficha.lunes, 4)}`;
    hoja.getCell("X2").value = "MES: " + mesesDeFicha(ficha.lunes);
    hoja.mergeCells("A4:AK4");
    for (let dia = 0; dia < 5; dia++) {
        hoja.mergeCells(5, 3 + dia * 7, 5, 9 + dia * 7);
    }
    const borde = estilo => ({ style: estilo, color: { argb: "FF000000" } });
    for (let r = 1; r <= 7 + estudiantes.length; r++) {
        const fila = hoja.getRow(r);
        fila.height = r >= 8 && estudiantes[r - 8].nombre.length > 38 ? 26 : 14;
        for (let c = 1; c <= 37; c++) {
            const celda = fila.getCell(c);
            // Las combinadas se formatean en su celda principal; las 35 casillas no se combinan.
            if (celda.isMerged && celda.master.address !== celda.address) continue;
            celda.font = { name: "Arial", size: 10, color: { argb: "FF000000" }, bold: r <= 7 && r !== 4 };
            celda.alignment = { horizontal: c === 2 && r >= 8 ? "left" : "center", vertical: "middle", wrapText: true };
            celda.border = {
                top: borde(r === 1 || r === 5 || r === 8 ? "medium" : "thin"),
                bottom: borde(r === 7 + estudiantes.length ? "medium" : "thin"),
                left: borde(c === 1 || (c >= 3 && (c - 3) % 7 === 0) ? "medium" : "thin"),
                right: borde(c === 37 || (c >= 3 && (c - 2) % 7 === 0) ? "medium" : "thin")
            };
            if (r <= 7) celda.fill = { type: "pattern", pattern: "solid", fgColor: { argb: r === 1 ? "FFD9D9D9" : "FFF2F2F2" } };
        }
    }
    hoja.getRow(1).height = 38;
    hoja.getCell("A1").font = { name: "Arial", size: 11, bold: true, color: { argb: "FF000000" } };
    hoja.getRow(2).height = 24;
    hoja.getCell("A2").font = { name: "Arial", size: 8, bold: true };
    hoja.getRow(4).height = 22;
    hoja.getCell("A4").font = { name: "Arial", size: 9 };
    hoja.getRow(5).height = 18;
    hoja.getRow(7).height = 16;
    // Contorno de las bandas combinadas, sin añadir bordes dentro de los títulos.
    for (const direccion of ["A1", "A4", "X2", "C5", "J5", "Q5", "X5", "AE5"]) {
        const celda = hoja.getCell(direccion);
        celda.border = { ...celda.border, right: borde("medium") };
    }
    const tecnica = libro.addWorksheet("_Asistem", { state: "hidden" });
    tecnica.addRows([
        ["ASISTEM", VERSION_PLANTILLA], ["Formato de datos", VERSION_FORMATO],
        ["Curso ID", ficha.curso.id], ["Lunes", ficha.lunes]
    ]);
    return libro;
}

function validarLibroExcel(libro) {
    if (libro.SheetNames.length !== 2 || !libro.Sheets.Asistencia || !libro.Sheets._Asistem) {
        throw new Error("Se requiere una ficha Asistem con las hojas Asistencia y _Asistem.");
    }
    function hojaLimitada(nombre, filas, columnas) {
        const hoja = libro.Sheets[nombre];
        const rango = XLSX.utils.decode_range(hoja["!fullref"] || hoja["!ref"] || "A1");
        if (rango.s.r !== 0 || rango.s.c !== 0 || rango.e.r !== filas - 1 || rango.e.c !== columnas - 1) {
            throw new Error(`${nombre}: dimensiones incompatibles; se esperan ${filas} filas y ${columnas} columnas.`);
        }
        // Se revisan también fórmulas en encabezados, identidades y metadatos.
        for (let r = 0; r < filas; r++) for (let c = 0; c < columnas; c++) {
            const direccion = XLSX.utils.encode_cell({ r, c });
            if (hoja[direccion]?.f !== undefined || hoja[direccion]?.F !== undefined) {
                throw new Error(`${nombre}!${direccion}: no se admiten fórmulas.`);
            }
        }
        return direccion => {
            const celda = hoja[direccion];
            if (celda?.t === "e") throw new Error(`${nombre}!${direccion}: contiene un error de Excel.`);
            return celda?.v ?? "";
        };
    }
    const principal = hojaLimitada("Asistencia", 7 + estudiantes.length, 38);
    const meta = hojaLimitada("_Asistem", 4, 2);
    const versionArchivo = meta("B1");
    const codigos = codigosImportacion(versionArchivo);
    const igual = (leer, celda, esperado, hoja) => {
        if (leer(celda) !== esperado) throw new Error(`${hoja}!${celda}: valor incompatible con la plantilla Asistem.`);
    };
    [["A1", "ASISTEM"], ["A2", "Formato de datos"],
        ["B2", VERSION_FORMATO], ["A3", "Curso ID"], ["B3", cursoActual.id], ["A4", "Lunes"]]
        .forEach(([celda, esperado]) => igual(meta, celda, esperado, "_Asistem"));
    const lunes = meta("B4");
    if (typeof lunes !== "string" || lunesDeSemana(lunes) !== lunes) throw new Error("_Asistem!B4: lunes inválido.");
    const posiciones = posicionesSemana(lunes);
    // Se admiten ambos encabezados históricos; nunca se deduce la codificación de ellos.
    if (!["Asistem — Ficha semanal de asistencia", encabezadoInstitucional(lunes)].includes(principal("A1"))) {
        throw new Error("Asistencia!A1: encabezado incompatible.");
    }
    if (!["Curso", "GRADO"].includes(principal("A2"))) throw new Error("Asistencia!A2: campo de curso incompatible.");
    [["B2", cursoActual.nombre],
        ["A3", "Lunes"], ["B3", lunes], ["C3", "Viernes"], ["D3", sumarDias(lunes, 4)],
        ["A7", "#"], ["B7", "Estudiante"], ["AL7", "ID estudiante"]]
        .forEach(([celda, esperado]) => igual(principal, celda, esperado, "Asistencia"));
    posiciones.forEach((p, i) => {
        const col = XLSX.utils.encode_col(i + 2);
        igual(principal, col + "6", p.fecha, "Asistencia");
        igual(principal, col + "7", p.hora, "Asistencia");
        if (p.hora === 1 && ![DIAS_LECTIVOS[p.dia], DIAS_LECTIVOS[p.dia].toUpperCase()].includes(principal(col + "5"))) {
            throw new Error(`Asistencia!${col}5: día incompatible.`);
        }
    });
    const ficha = { versionFormato: VERSION_FORMATO, curso: { ...cursoActual }, lunes,
        estudiantes: estudiantes.map(({ id, nombre }) => ({ id, nombre })), marcaciones: {}, revision: 0, revisionExcel: 0 };
    const vistos = new Set();
    for (let fila = 8; fila < 8 + estudiantes.length; fila++) {
        const id = principal("AL" + fila);
        const estudiante = estudiantes.find(e => e.id === id);
        if (!estudiante || vistos.has(id)) throw new Error(`Asistencia!AL${fila}: identificador desconocido o duplicado.`);
        vistos.add(id);
        igual(principal, "B" + fila, estudiante.nombre, "Asistencia");
        igual(principal, "A" + fila, estudiante.numero, "Asistencia");
        posiciones.forEach((p, i) => {
            const celda = XLSX.utils.encode_col(i + 2) + fila;
            const valor = principal(celda);
            if (typeof valor !== "string") throw new Error(`Asistencia!${celda}: se esperaba un código de asistencia o una celda vacía.`);
            let codigo = valor.trim().toUpperCase();
            if (!codigo) return;
            if (versionArchivo === 2 && (codigo === "·" || codigo === "•")) codigo = ".";
            if (!Object.hasOwn(codigos, codigo)) {
                throw new Error(`Asistencia!${celda}: código no permitido en la versión ${versionArchivo}. Usa ${Object.keys(codigos).join(", ")} o una celda vacía.`);
            }
            ficha.marcaciones[p.fecha] ??= {};
            ficha.marcaciones[p.fecha][p.hora] ??= {};
            ficha.marcaciones[p.fecha][p.hora][id] = codigos[codigo];
        });
    }
    validarBorrador({ versionFormato: VERSION_FORMATO, fichas: [ficha] });
    return ficha;
}

function leerExcel(bytes) {
    if (!bytes.byteLength || bytes.byteLength > LIMITE_EXCEL) throw new Error("El archivo debe ocupar entre 1 byte y 5 MB.");
    const firma = new Uint8Array(bytes);
    if (firma[0] !== 80 || firma[1] !== 75) throw new Error("El archivo no es un XLSX válido.");
    // Límite de lectura y comprobación de !fullref antes de recorrer las hojas.
    const libro = XLSX.read(bytes, { type: "array", sheetRows: 100, cellFormula: true, cellDates: false });
    return validarLibroExcel(libro);
}
