// ================================
// ELEMENTOS HTML
// ================================

const lista = document.getElementById("lista-estudiantes");

const busqueda = document.getElementById("busqueda");

const filtro = document.getElementById("filtro");

const fecha = document.getElementById("fecha");

const aviso = document.getElementById("aviso");

const resumen = document.getElementById("resumen");

const cantidadVisible = document.getElementById("cantidad-visible");
const sinCoincidencias = document.getElementById("sin-coincidencias");
const botonMasivo = document.getElementById("marcar-todos");
const menuMasivo = document.getElementById("menu-masivo");
const modalMasivo = document.getElementById("confirmacion-masiva");
const cancelarMasiva = document.getElementById("cancelar-masiva");
const confirmarMasiva = document.getElementById("confirmar-masiva");
const notificacion = document.getElementById("notificacion");

let estadoPendiente = null;
let temporizadorNotificacion;
let ultimoClicConfirmado = null;


// ================================
// PREPARAR FILTRO Y RESUMEN
// ================================

function prepararEstados() {

    estadosAsistencia.forEach(estado => {

        const opcion = document.createElement("option");
        opcion.value = estado.valor;
        opcion.textContent = estado.texto;
        filtro.appendChild(opcion);

        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta";

        const etiqueta = document.createElement("span");
        etiqueta.textContent = estado.texto;

        const cantidad = document.createElement("strong");
        cantidad.id = "resumen-" + estado.valor;
        cantidad.textContent = "0";

        tarjeta.appendChild(etiqueta);
        tarjeta.appendChild(cantidad);
        resumen.appendChild(tarjeta);

        if (estado.oficial) {
            const accion = document.createElement("button");
            accion.type = "button";
            accion.textContent = estado.texto;
            accion.setAttribute("role", "menuitem");
            accion.tabIndex = -1;
            accion.onclick = function () {
                abrirConfirmacion(estado);
            };
            menuMasivo.appendChild(accion);
        }

    });

}


// ================================
// FECHA
// ================================




// ================================
// MOSTRAR ESTUDIANTES
// ================================

function mostrarEstudiantes() {

    lista.innerHTML = "";

    const textoBusqueda = busqueda.value.toLowerCase();

    const estadoFiltro = filtro.value;
    let visibles = 0;


    estudiantes.forEach((estudiante, indice) => {

        // Buscar por nombre

        const coincideNombre =
            estudiante.nombre
            .toLowerCase()
            .includes(textoBusqueda);


        // Filtrar por estado

        const coincideEstado =
            estadoFiltro === "todos" ||
            estadoDe(estudiante.id) === estadoFiltro;


        // Si no coincide, no mostrar

        if (!coincideNombre || !coincideEstado) {
            return;
        }

        visibles++;

        // Crear fila

        const fila = document.createElement("tr");
        fila.dataset.estado = estadoDe(estudiante.id);


        // Número

        const numero = document.createElement("td");

        numero.className = "numero-estudiante";
        numero.textContent = indice + 1;


        // Nombre

        const nombre = document.createElement("td");

        nombre.className = "nombre-estudiante";
        nombre.textContent = estudiante.nombre;


        // Acciones

        const acciones = document.createElement("td");
        acciones.className = "columna-acciones";

        const grupoBotones = document.createElement("div");
        grupoBotones.className = "acciones-asistencia";
        grupoBotones.setAttribute("role", "group");
        grupoBotones.setAttribute("aria-label", "Asistencia de " + estudiante.nombre);

        estadosOficiales.forEach(estadoOficial => {

            const boton = document.createElement("button");
            const seleccionado = estadoDe(estudiante.id) === estadoOficial.valor;

            boton.type = "button";
            boton.textContent = estadoOficial.textoBoton || estadoOficial.texto;
            boton.title = (estadoOficial.descripcion || estadoOficial.texto) +
                " Pulsa de nuevo para volver a Sin registrar.";
            boton.className = "boton-estado";
            boton.dataset.estado = estadoOficial.valor;
            boton.dataset.estudiante = estudiante.id;
            boton.classList.toggle("seleccionado", seleccionado);
            boton.setAttribute("aria-label", estadoOficial.texto);
            boton.setAttribute("aria-pressed", seleccionado ? "true" : "false");

            boton.onclick = function () {
                cambiarEstado(estudiante.id, estadoOficial.valor);

                // La tabla se reconstruye: conservamos el foco para usar el teclado.
                const botonActual = lista.querySelector(
                    `[data-estudiante="${estudiante.id}"][data-estado="${estadoOficial.valor}"]`
                );
                (botonActual || filtro).focus({ preventScroll: true });
            };

            grupoBotones.appendChild(boton);

        });

        acciones.appendChild(grupoBotones);



        fila.appendChild(numero);

        fila.appendChild(nombre);

        fila.appendChild(acciones);


        lista.appendChild(fila);

    });


    cantidadVisible.textContent = `Mostrando ${visibles} de ${estudiantes.length}`;
    sinCoincidencias.hidden = visibles !== 0;

    actualizarResumen();
    actualizarAvisoExcel();

}


// ================================
// CAMBIAR ESTADO
// ================================

function cambiarEstado(id, nuevoEstado) {
    asignarEstado(id, estadoDe(id) === nuevoEstado ? "sin-registrar" : nuevoEstado);
    guardarBorrador();
    mostrarEstudiantes();
}


// ================================
// MENÚ DE ACCIONES MASIVAS
// ================================

function abrirMenu(ultimaOpcion = false) {

    menuMasivo.hidden = false;
    botonMasivo.setAttribute("aria-expanded", "true");
    const opcion = ultimaOpcion ? menuMasivo.lastElementChild : menuMasivo.firstElementChild;
    opcion.focus();

}

function cerrarMenu(devolverFoco = true) {

    menuMasivo.hidden = true;
    botonMasivo.setAttribute("aria-expanded", "false");
    if (devolverFoco) {
        botonMasivo.focus({ preventScroll: true });
    }

}


// ================================
// CONFIRMAR Y APLICAR A TODO EL GRUPO
// ================================

function abrirConfirmacion(estado) {

    if (modalMasivo.open) {
        return;
    }

    cerrarMenu(false);
    estadoPendiente = estado;
    document.getElementById("titulo-confirmacion").textContent =
        `Marcar todos como “${estado.texto}”`;
    document.getElementById("mensaje-confirmacion").textContent =
        `Esta acción asignará el estado “${estado.texto}” a los ${estudiantes.length} estudiantes del grupo, únicamente el ${sesionActiva.fecha}, hora ${sesionActiva.hora}. ` +
        "y reemplazará cualquier marcación anterior, incluso la de estudiantes ocultos por la búsqueda o el filtro.";

    confirmarMasiva.disabled = false;
    // showModal bloquea el fondo y presenta un diálogo propio de la página.
    modalMasivo.showModal();
    cancelarMasiva.focus();

}

function cerrarConfirmacion() {

    estadoPendiente = null;
    confirmarMasiva.disabled = true;
    modalMasivo.close();
    botonMasivo.focus({ preventScroll: true });

}

function aplicarEstadoMasivo(evento) {

    if (!modalMasivo.open || estadoPendiente === null) {
        return;
    }

    const estado = estadoPendiente;
    // Consumimos la elección antes de modificar datos para impedir ejecuciones dobles.
    estadoPendiente = null;
    confirmarMasiva.disabled = true;

    if (evento && evento.detail > 0) {
        ultimoClicConfirmado = {
            x: evento.clientX,
            y: evento.clientY,
            momento: evento.timeStamp
        };
    }

    // Asignamos a la lista completa; la acción individual sí alterna el estado.
    estudiantes.forEach(estudiante => {
        asignarEstado(estudiante.id, estado.valor);
    });

    guardarBorrador();
    mostrarEstudiantes();
    cerrarConfirmacion();
    mostrarNotificacion(`${estudiantes.length} estudiantes actualizados. Estado: “${estado.texto}”.`);

}

function mostrarNotificacion(mensaje) {

    clearTimeout(temporizadorNotificacion);
    notificacion.textContent = mensaje;
    temporizadorNotificacion = setTimeout(function () {
        notificacion.textContent = "";
    }, 4500);

}


// ================================
// CONTAR ESTUDIANTES POR ESTADO
// ================================

function contarEstudiantesPorEstado(valor) {

    return estudiantes.filter(estudiante => estadoDe(estudiante.id) === valor).length;

}


// ================================
// ACTUALIZAR RESUMEN
// ================================

function actualizarResumen() {

    document.getElementById("total").textContent = estudiantes.length;

    // El resumen siempre cuenta la lista completa, aunque haya filtros activos.
    estadosAsistencia.forEach(estado => {

        document.getElementById("resumen-" + estado.valor).textContent =
            contarEstudiantesPorEstado(estado.valor);

    });

    const sinRegistrar = contarEstudiantesPorEstado("sin-registrar");


    // Mostrar u ocultar aviso

    if (sinRegistrar > 0) {

        aviso.style.display = "block";

        aviso.textContent =
            `⚠️ Hay ${sinRegistrar} estudiante(s) sin registrar.`;

    } else {

        aviso.style.display = "none";

    }

}


// ================================
// BUSCADOR
// ================================

busqueda.addEventListener(
    "input",
    mostrarEstudiantes
);


// ================================
// FILTRO
// ================================

filtro.addEventListener(
    "change",
    mostrarEstudiantes
);


// ================================
// ACCIÓN MASIVA
// ================================

botonMasivo.addEventListener("click", function () {
    if (menuMasivo.hidden) {
        abrirMenu();
    } else {
        cerrarMenu();
    }
});

botonMasivo.addEventListener("keydown", function (evento) {
    if (evento.key === "ArrowDown" || evento.key === "ArrowUp") {
        evento.preventDefault();
        abrirMenu(evento.key === "ArrowUp");
    }
});

menuMasivo.addEventListener("keydown", function (evento) {
    if (evento.key === "Tab") {
        // Tab continúa desde el botón principal hacia los controles de la página.
        cerrarMenu();
        return;
    }

    const opciones = Array.from(menuMasivo.children);
    let posicion = opciones.indexOf(document.activeElement);

    if (evento.key === "ArrowDown") {
        posicion = (posicion + 1) % opciones.length;
    } else if (evento.key === "ArrowUp") {
        posicion = (posicion - 1 + opciones.length) % opciones.length;
    } else if (evento.key === "Home") {
        posicion = 0;
    } else if (evento.key === "End") {
        posicion = opciones.length - 1;
    } else {
        return;
    }

    evento.preventDefault();
    opciones[posicion].focus();
});

document.addEventListener("click", function (evento) {
    if (!menuMasivo.hidden && !botonMasivo.parentElement.contains(evento.target)) {
        cerrarMenu(false);
    }
});

document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && !menuMasivo.hidden) {
        evento.preventDefault();
        cerrarMenu();
    }
});

cancelarMasiva.addEventListener("click", cerrarConfirmacion);
confirmarMasiva.addEventListener("click", aplicarEstadoMasivo);

// Tras cerrar el modal, el segundo clic de un doble clic puede caer en la tabla.
// Interceptamos solo pulsaciones inmediatas en la misma posición, sin demorar el cierre.
document.addEventListener("click", function (evento) {
    if (ultimoClicConfirmado === null) {
        return;
    }

    const mismaPosicion = Math.abs(evento.clientX - ultimoClicConfirmado.x) <= 6 &&
        Math.abs(evento.clientY - ultimoClicConfirmado.y) <= 6;
    const inmediato = evento.timeStamp - ultimoClicConfirmado.momento <= 500;

    if (evento.detail > 0 && mismaPosicion && inmediato) {
        evento.preventDefault();
        evento.stopImmediatePropagation();
        botonMasivo.focus({ preventScroll: true });
    } else {
        ultimoClicConfirmado = null;
    }
}, true);

modalMasivo.addEventListener("cancel", function (evento) {
    evento.preventDefault();
    cerrarConfirmacion();
});

modalMasivo.addEventListener("click", function (evento) {
    const limites = modalMasivo.getBoundingClientRect();
    const fuera = evento.clientX < limites.left || evento.clientX > limites.right ||
        evento.clientY < limites.top || evento.clientY > limites.bottom;
    if (evento.target === modalMasivo && fuera) {
        cerrarConfirmacion();
    }
});

modalMasivo.addEventListener("keydown", function (evento) {
    if (evento.key !== "Tab") {
        return;
    }

    if (evento.shiftKey && document.activeElement === cancelarMasiva) {
        evento.preventDefault();
        confirmarMasiva.focus();
    } else if (!evento.shiftKey && document.activeElement === confirmarMasiva) {
        evento.preventDefault();
        cancelarMasiva.focus();
    }
});


// ================================
// GUARDAR
// ================================

document.getElementById("guardar").addEventListener("click", () => guardarBorrador(true));

prepararEstados();
iniciarPortada();
iniciarExcel();
