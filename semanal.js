let lunesVistaSemanal = null;
let importacionPendiente = null;
let leyendoExcel = false;
let generandoExcel = false;

function descripcionFicha(ficha) {
    return `${ficha.curso.nombre} · ${ficha.lunes} — ${sumarDias(ficha.lunes, 4)}`;
}

function lunesSeleccionado() {
    if (!document.getElementById("asistencia").hidden) return sesionActiva.ficha.lunes;
    if (!document.getElementById("vista-semanal").hidden) return lunesVistaSemanal;
    return lunesDeSemana(document.getElementById("referencia").value);
}

function actualizarAvisoExcel() {
    const etiqueta = document.getElementById("contexto-excel");
    try {
        const lunes = lunesSeleccionado();
        const ficha = espacioTrabajo.fichas.find(f => f.lunes === lunes && f.curso.id === cursoActual.id);
        etiqueta.textContent = `${cursoActual.nombre} · ${lunes} — ${sumarDias(lunes, 4)}`;
        document.getElementById("pendiente-excel").textContent = !ficha || ficha.revisionExcel === undefined || ficha.revisionExcel !== (ficha.revision || 0)
            ? "Hay cambios pendientes de llevar a Excel." : "Sin cambios posteriores a la última generación o importación de Excel.";
        document.getElementById("ver-semanal").disabled = false;
        document.getElementById("descargar-excel").disabled = generandoExcel;
    } catch {
        etiqueta.textContent = "Selecciona una fecha válida en la portada.";
        document.getElementById("pendiente-excel").textContent = "";
        document.getElementById("ver-semanal").disabled = true;
        document.getElementById("descargar-excel").disabled = true;
    }
}

function mensajeExcel(texto) {
    document.getElementById("mensaje-excel").textContent = texto;
}

function mostrarFichaSemanal(lunes) {
    const ficha = obtenerFicha(lunes);
    lunesVistaSemanal = lunes;
    cerrarMenu(false);
    document.getElementById("portada").hidden = true;
    document.getElementById("asistencia").hidden = true;
    document.getElementById("contexto-asistencia").hidden = true;
    document.getElementById("vista-semanal").hidden = false;
    document.getElementById("titulo-semanal").textContent = "Ficha semanal · " + descripcionFicha(ficha);
    const tabla = document.getElementById("tabla-semanal");
    tabla.replaceChildren();
    const cabecera = document.createElement("thead");
    const dias = document.createElement("tr");
    const horas = document.createElement("tr");
    function celda(fila, tipo, texto) {
        const nueva = document.createElement(tipo);
        nueva.textContent = texto;
        fila.appendChild(nueva);
        return nueva;
    }
    celda(dias, "th", "#").rowSpan = 2;
    const nombre = celda(dias, "th", "Estudiante");
    nombre.rowSpan = 2;
    nombre.className = "nombre-semanal";
    diasDeSemana(lunes).forEach((fecha, i) => {
        const grupo = celda(dias, "th", `${DIAS_LECTIVOS[i]} · ${fecha}`);
        grupo.colSpan = 7;
        grupo.scope = "colgroup";
        for (let hora = 1; hora <= 7; hora++) {
            const th = celda(horas, "th", "");
            th.scope = "col";
            const boton = document.createElement("button");
            boton.type = "button";
            boton.textContent = hora;
            boton.setAttribute("aria-label", `Abrir ${fecha}, hora ${hora}`);
            boton.onclick = () => entrarAsistencia(fecha, hora);
            th.appendChild(boton);
        }
    });
    cabecera.appendChild(dias);
    cabecera.appendChild(horas);
    tabla.appendChild(cabecera);
    const cuerpo = document.createElement("tbody");
    estudiantes.forEach(e => {
        const fila = document.createElement("tr");
        celda(fila, "td", e.numero);
        celda(fila, "th", e.nombre).className = "nombre-semanal";
        posicionesSemana(lunes).forEach(p => {
            const codigo = codigoEnFicha(ficha, p.fecha, p.hora, e.id);
            const td = celda(fila, "td", codigo);
            td.title = codigo ? estadosOficiales.find(e => e.simbolo === codigo).texto : "Sin registrar";
        });
        cuerpo.appendChild(fila);
    });
    tabla.appendChild(cuerpo);
    document.getElementById("leyenda-semanal").textContent = leyendaExcel();
    guardarBorrador();
    actualizarAvisoExcel();
    document.getElementById("titulo-semanal").focus();
}

function iniciarDescargaExcel(bytes, nombre) {
    const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    try {
        enlace.href = url;
        enlace.download = nombre;
        document.body.appendChild(enlace);
        enlace.click();
    } finally {
        enlace.remove();
        // Permite que el navegador consuma el recurso antes de liberarlo.
        setTimeout(() => URL.revokeObjectURL(url), 60000);
    }
}

async function descargarFichaExcel() {
    if (generandoExcel) return;
    generandoExcel = true;
    actualizarAvisoExcel();
    try {
        const ficha = obtenerFicha(lunesSeleccionado());
        // Copia temporal de exportación: las ediciones durante el await siguen pendientes.
        const copia = JSON.parse(JSON.stringify(ficha));
        mensajeExcel(`Generando Excel: ${descripcionFicha(copia)}…`);
        const libro = crearLibroExcel(copia);
        const bytes = await libro.xlsx.writeBuffer();
        iniciarDescargaExcel(bytes, `Asistem_11-3_${copia.lunes}.xlsx`);
        // Si se importó otra ficha de esa semana mientras se generaba, no marcarla como exportada.
        if (espacioTrabajo.fichas.includes(ficha)) ficha.revisionExcel = copia.revision || 0;
        guardarBorrador();
        mensajeExcel(`${descripcionFicha(copia)}: Descarga iniciada. Conserva el archivo actualizado; el Excel original no se modifica automáticamente.`);
    } catch (error) {
        mensajeExcel("No se pudo generar la ficha Excel. " + error.message);
    } finally {
        generandoExcel = false;
        actualizarAvisoExcel();
    }
}

function cerrarImportacion(cancelada = true) {
    importacionPendiente = null;
    document.getElementById("confirmar-importacion").disabled = true;
    document.getElementById("modal-importacion").close();
    document.getElementById("abrir-excel").focus();
    if (cancelada) mensajeExcel("Importación cancelada. Las fichas y el borrador no cambiaron.");
}

function prepararImportacion(ficha) {
    const existente = espacioTrabajo.fichas.some(f => f.curso.id === ficha.curso.id && f.lunes === ficha.lunes);
    const cantidad = posicionesSemana(ficha.lunes).reduce((total, p) => total + Object.keys(ficha.marcaciones[p.fecha]?.[p.hora] || {}).length, 0);
    importacionPendiente = ficha;
    document.getElementById("resumen-importacion").textContent = `${descripcionFicha(ficha)}. ${ficha.estudiantes.length} estudiantes; ${cantidad} marcaciones de ${ficha.estudiantes.length * 35} casillas.`;
    document.getElementById("advertencia-importacion").textContent = existente
        ? `Esta ficha reemplazará las asistencias de ${descripcionFicha(ficha)}, incluidas las casillas vacías. Las demás semanas no cambiarán. Descarga primero la versión actual si necesitas conservarla.`
        : "Se incorporará esta semana al espacio de trabajo. Las demás semanas no cambiarán.";
    const confirmar = document.getElementById("confirmar-importacion");
    confirmar.textContent = existente ? "Reemplazar ficha" : "Incorporar ficha";
    confirmar.disabled = false;
    document.getElementById("modal-importacion").showModal();
    document.getElementById("cancelar-importacion").focus();
}

function confirmarImportacion() {
    if (!importacionPendiente || !document.getElementById("modal-importacion").open) return;
    const ficha = importacionPendiente;
    // La validación ya terminó: una única sustitución de la semana, sin mezclar registros.
    const indice = espacioTrabajo.fichas.findIndex(f => f.curso.id === ficha.curso.id && f.lunes === ficha.lunes);
    if (indice < 0) espacioTrabajo.fichas.push(ficha);
    else espacioTrabajo.fichas[indice] = ficha;
    if (sesionActiva?.ficha.lunes === ficha.lunes) sesionActiva.ficha = ficha;
    cerrarImportacion(false);
    document.getElementById("referencia").value = ficha.lunes;
    volverPortada();
    actualizarDias();
    guardarBorrador();
    mensajeExcel(`Ficha incorporada al espacio de trabajo: ${descripcionFicha(ficha)}. El resultado del borrador se muestra por separado.`);
}

function iniciarExcel() {
    const archivo = document.getElementById("archivo-excel");
    document.getElementById("abrir-excel").onclick = () => {
        archivo.value = "";
        archivo.click();
    };
    archivo.addEventListener("cancel", () => mensajeExcel("Selección cancelada. No se modificó ninguna ficha."));
    archivo.addEventListener("change", async () => {
        if (leyendoExcel) return;
        const fichero = archivo.files[0];
        if (!fichero) { mensajeExcel("Selección cancelada. No se modificó ninguna ficha."); return; }
        leyendoExcel = true;
        document.getElementById("abrir-excel").disabled = true;
        try {
            if (!/\.xlsx$/i.test(fichero.name) || fichero.size > LIMITE_EXCEL) throw new Error("Selecciona un .xlsx de hasta 5 MB.");
            const ficha = leerExcel(await fichero.arrayBuffer());
            prepararImportacion(ficha);
        } catch (error) {
            importacionPendiente = null;
            mensajeExcel("No se importó el archivo. " + error.message);
        } finally {
            leyendoExcel = false;
            archivo.value = "";
            document.getElementById("abrir-excel").disabled = false;
        }
    });
    document.getElementById("ver-semanal").onclick = () => mostrarFichaSemanal(lunesSeleccionado());
    document.getElementById("descargar-excel").onclick = descargarFichaExcel;
    document.getElementById("volver-semanal-portada").onclick = volverPortada;
    document.getElementById("cancelar-importacion").onclick = () => cerrarImportacion();
    document.getElementById("confirmar-importacion").onclick = confirmarImportacion;
    const modal = document.getElementById("modal-importacion");
    modal.addEventListener("cancel", evento => { evento.preventDefault(); cerrarImportacion(); });
    modal.addEventListener("click", evento => {
        const r = modal.getBoundingClientRect();
        if (evento.target === modal && (evento.clientX < r.left || evento.clientX > r.right || evento.clientY < r.top || evento.clientY > r.bottom)) cerrarImportacion();
    });
    modal.addEventListener("keydown", evento => {
        if (evento.key !== "Tab") return;
        const cancelar = document.getElementById("cancelar-importacion");
        const confirmar = document.getElementById("confirmar-importacion");
        if (evento.shiftKey && document.activeElement === cancelar) { evento.preventDefault(); confirmar.focus(); }
        else if (!evento.shiftKey && document.activeElement === confirmar) { evento.preventDefault(); cancelar.focus(); }
    });
    actualizarAvisoExcel();
}
