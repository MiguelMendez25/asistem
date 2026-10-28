const CLAVE_BORRADOR = "asistem.borrador.v1";
let textoBorradorLeido = null;
let borradorBloqueado = false;
let cambiosEnMemoria = false;

function informarBorrador(actualizado, detalle) {
    const estado = document.getElementById("estado-borrador");
    estado.className = actualizado ? "borrador actualizado" : "borrador memoria";
    estado.textContent = (actualizado ? "Borrador local actualizado. " : "Cambios solo en memoria. ") + detalle;
}

function recuperarBorrador() {
    try {
        textoBorradorLeido = localStorage.getItem(CLAVE_BORRADOR);
        if (textoBorradorLeido !== null) {
            espacioTrabajo = validarBorrador(JSON.parse(textoBorradorLeido));
        }
    } catch (error) {
        borradorBloqueado = true;
        informarBorrador(false, "No se pudo leer un borrador válido. Se conserva sin sobrescribir. Esta sesión puede continuar en memoria.");
    }
}

function guardarBorrador(manual = false) {
    cambiosEnMemoria = true;
    if (borradorBloqueado) {
        informarBorrador(false, "El borrador anterior no pudo leerse o es incompatible. No se sobrescribirá. No cierres esta página si necesitas conservar esta sesión.");
        return false;
    }
    try {
        // Detecta otra pestaña antes de reemplazar un borrador que no hemos leído.
        if (localStorage.getItem(CLAVE_BORRADOR) !== textoBorradorLeido) {
            borradorBloqueado = true;
            throw new Error("El borrador cambió en otra pestaña; no se sobrescribió.");
        }
        const texto = JSON.stringify(espacioTrabajo);
        localStorage.setItem(CLAVE_BORRADOR, texto);
        textoBorradorLeido = texto;
        if (localStorage.getItem(CLAVE_BORRADOR) !== texto) throw new Error("No se pudo verificar la escritura.");
        cambiosEnMemoria = false;
        informarBorrador(true, "Recuperación disponible en este navegador; no sustituye una ficha Excel transportable.");
        if (manual) mostrarNotificacion("Borrador local escrito y verificado, incluidas las marcaciones parciales.");
        return true;
    } catch (error) {
        informarBorrador(false, "No se pudo guardar: " + error.message + " La sesión sigue disponible aquí. No cierres la página.");
        return false;
    }
}

function actualizarDias() {
    const referencia = document.getElementById("referencia").value;
    const selector = document.getElementById("dia");
    const abrir = document.getElementById("abrir-asistencia");
    selector.replaceChildren();
    abrir.disabled = true;
    try {
        const lunes = lunesDeSemana(referencia);
        const dias = diasDeSemana(lunes);
        document.getElementById("intervalo").textContent = `${lunes} — ${dias[4]} (lunes–viernes)`;
        const finDeSemana = !dias.includes(referencia);
        if (finDeSemana) {
            const opcion = new Option("Selecciona un día lectivo", "");
            selector.add(opcion);
        }
        dias.forEach((dia, i) => selector.add(new Option(["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"][i] + " · " + dia, dia)));
        selector.value = finDeSemana ? "" : referencia;
        document.getElementById("aviso-fecha").textContent = finDeSemana
            ? "La referencia cae en fin de semana. Selecciona un día de lunes a viernes." : "";
        abrir.disabled = finDeSemana;
    } catch {
        document.getElementById("intervalo").textContent = "Introduce una fecha válida para calcular la semana.";
        document.getElementById("aviso-fecha").textContent = "";
    }
    actualizarAvisoExcel();
}

function actualizarFichas() {
    const selector = document.getElementById("fichas");
    selector.replaceChildren(new Option("Elegir una semana del espacio de trabajo", ""));
    espacioTrabajo.fichas.forEach(ficha => selector.add(new Option(`${ficha.curso.nombre} · ${ficha.lunes} — ${sumarDias(ficha.lunes, 4)}`, ficha.lunes)));
}

function iniciarPortada() {
    const selectorAsignatura = document.getElementById("asignatura");
    catalogoAsignaturas.forEach(a => selectorAsignatura.add(new Option(a.nombre, a.id)));
    selectorAsignatura.addEventListener("change", () => {
        asignarAsignatura(selectorAsignatura.value);
        guardarBorrador();
        actualizarAvisoExcel();
    });
    recuperarBorrador();
    if (!borradorBloqueado) guardarBorrador(); // Comprueba lectura, escritura y recuperación real.
    const hoy = new Date();
    document.getElementById("referencia").value = `${String(hoy.getFullYear()).padStart(4, "0")}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
    actualizarDias();
    actualizarFichas();
    document.getElementById("referencia").addEventListener("change", actualizarDias);
    document.getElementById("dia").addEventListener("change", () => {
        document.getElementById("abrir-asistencia").disabled = !document.getElementById("dia").value;
    });
    document.getElementById("fichas").addEventListener("change", evento => {
        if (!evento.target.value) return;
        document.getElementById("referencia").value = evento.target.value;
        actualizarDias();
    });
    document.getElementById("seleccion-asistencia").addEventListener("submit", evento => {
        evento.preventDefault();
        try {
            abrirSesion(document.getElementById("dia").value, Number(document.getElementById("hora").value));
        } catch (error) {
            document.getElementById("aviso-fecha").textContent = error.message;
            return;
        }
        mostrarSesionActiva();
    });
    document.getElementById("volver-portada").addEventListener("click", volverPortada);
    window.addEventListener("beforeunload", evento => {
        if (cambiosEnMemoria) { evento.preventDefault(); evento.returnValue = ""; }
    });
}

function mostrarSesionActiva() {
    document.getElementById("portada").hidden = true;
    document.getElementById("vista-semanal").hidden = true;
    document.getElementById("asistencia").hidden = false;
    document.getElementById("contexto-asistencia").hidden = false;
    document.getElementById("semana-activa").textContent = sesionActiva.ficha.lunes + " — " + sumarDias(sesionActiva.ficha.lunes, 4);
    fecha.textContent = sesionActiva.fecha;
    document.getElementById("hora-activa").textContent = sesionActiva.hora;
    document.getElementById("asignatura").value = asignaturaEnFicha(sesionActiva.ficha, sesionActiva.fecha, sesionActiva.hora)?.id || "";
    mostrarEstudiantes();
    guardarBorrador();
    actualizarAvisoExcel();
    document.getElementById("volver-portada").focus();
}

function entrarAsistencia(fechaElegida, hora) {
    abrirSesion(fechaElegida, hora);
    mostrarSesionActiva();
}

function volverPortada() {
    cerrarMenu(false);
    document.getElementById("asistencia").hidden = true;
    document.getElementById("vista-semanal").hidden = true;
    document.getElementById("contexto-asistencia").hidden = true;
    document.getElementById("portada").hidden = false;
    actualizarFichas();
    actualizarAvisoExcel();
    document.getElementById("referencia").focus();
}
