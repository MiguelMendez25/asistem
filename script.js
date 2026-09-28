
// ================================
// ESTUDIANTES
// ================================

const estudiantes = [

    {
        numero: 1,
        nombre: "AGUIRRE VEGA SARAY SOFIA",
        estado: "sin-registrar"
    },

    {
        numero: 2,
        nombre: "ALDANA RUBIO ANA VICTORIA",
        estado: "sin-registrar"
    },

    {
        numero: 3,
        nombre: "BAQUERO FLOREZ NATALIA CAROLINA",
        estado: "sin-registrar"
    },

    {
        numero: 4,
        nombre: "BARAZARTE MARTINEZ STEFANY",
        estado: "sin-registrar"
    },

    {
        numero: 5,
        nombre: "BONILLA SERPA SANTIAGO JESUS",
        estado: "sin-registrar"
    },

    {
        numero: 6,
        nombre: "CALLE ESCALONA PAOLA CRISTINA DEL CARMEN",
        estado: "sin-registrar"
    },

    {
        numero: 7,
        nombre: "CASTRO MESTRA SHEYLA",
        estado: "sin-registrar"
    },

    {
        numero: 8,
        nombre: "CASTRO SALGADO VERONICA",
        estado: "sin-registrar"
    },

    {
        numero: 9,
        nombre: "CLARA PEÑALOZA DANIEL ALEJANDRO",
        estado: "sin-registrar"
    },

    {
        numero: 10,
        nombre: "CONTRERAS BETANCUR KAROL LUCIA",
        estado: "sin-registrar"
    },

    {
        numero: 11,
        nombre: "DIAZ HURTADO ALEJANDRA",
        estado: "sin-registrar"
    },

    {
        numero: 12,
        nombre: "GUERRA ORTIZ SEBASTIAN",
        estado: "sin-registrar"
    },

    {
        numero: 13,
        nombre: "GUZMAN GUERRA ALEJANDRA MARIA",
        estado: "sin-registrar"
    },

    {
        numero: 14,
        nombre: "HERNANDEZ BARRAYAN LUIS ANGEL",
        estado: "sin-registrar"
    },

    {
        numero: 15,
        nombre: "HERNANDEZ HERNANDEZ ALEXANDER JOSE",
        estado: "sin-registrar"
    },

    {
        numero: 16,
        nombre: "HOYOS GONZALEZ ISSAMAR",
        estado: "sin-registrar"
    },

    {
        numero: 17,
        nombre: "HUMANEZ AGUIRRE NICOLE",
        estado: "sin-registrar"
    },

    {
        numero: 18,
        nombre: "LARA LAZARO ALEX JOSÉ",
        estado: "sin-registrar"
    },

    {
        numero: 19,
        nombre: "LARA MERCADO MARIANGEL",
        estado: "sin-registrar"
    },

    {
        numero: 20,
        nombre: "LARA MERCADO MOISES",
        estado: "sin-registrar"
    },

    {
        numero: 21,
        nombre: "LOBO OTERO TANIA",
        estado: "sin-registrar"
    },

    {
        numero: 22,
        nombre: "LOZANO PEÑATA ANALIA",
        estado: "sin-registrar"
    },

    {
        numero: 23,
        nombre: "MACEA VEGA SAMUEL ESTEBAN",
        estado: "sin-registrar"
    },

    {
        numero: 24,
        nombre: "MARRUGO ESTRADA LINDA MICHELLE",
        estado: "sin-registrar"
    },

    {
        numero: 25,
        nombre: "MARSIGLIA ARRIETA VICTORIA",
        estado: "sin-registrar"
    },

    {
        numero: 26,
        nombre: "MARTINEZ RAMOS VALENTINA",
        estado: "sin-registrar"
    },

    {
        numero: 27,
        nombre: "MENDEZ DIAZ MIGUEL ANGEL",
        estado: "sin-registrar"
    },

    {
        numero: 28,
        nombre: "MONTIEL BARRIOS ELIZABETH",
        estado: "sin-registrar"
    },

    {
        numero: 29,
        nombre: "MORENO GUERRA MARIA CAMILA",
        estado: "sin-registrar"
    },

    {
        numero: 30,
        nombre: "NARVAEZ VERGARA MANUEL ALEJANDRO",
        estado: "sin-registrar"
    },

    {
        numero: 31,
        nombre: "OVIEDO DIAZ SAMUEL SAID",
        estado: "sin-registrar"
    },

    {
        numero: 32,
        nombre: "SABIE VALERO JHASETH JOSE",
        estado: "sin-registrar"
    },

    {
        numero: 33,
        nombre: "SALGADO RAMOS GABRIELA",
        estado: "sin-registrar"
    },

    {
        numero: 34,
        nombre: "SANCHEZ CASTILLO JUNIOR ALFONSO",
        estado: "sin-registrar"
    },

    {
        numero: 35,
        nombre: "SANTANA ACEVEDO MARIANGEL",
        estado: "sin-registrar"
    },

    {
        numero: 36,
        nombre: "TIRADO PANTOJA STHEFANNY DEL CARMEN",
        estado: "sin-registrar"
    },

    {
        numero: 37,
        nombre: "VASQUEZ TIRADO SALMA",
        estado: "sin-registrar"
    },

    {
        numero: 38,
        nombre: "ZABALA QUINTERO CARLOS EDUARDO",
        estado: "sin-registrar"
    }

];



// ================================
// ELEMENTOS HTML
// ================================

const lista = document.getElementById("lista-estudiantes");

const busqueda = document.getElementById("busqueda");

const filtro = document.getElementById("filtro");

const fecha = document.getElementById("fecha");

const aviso = document.getElementById("aviso");


// ================================
// FECHA
// ================================

const hoy = new Date();

fecha.textContent = hoy.toLocaleDateString("es-CO");


// ================================
// MOSTRAR ESTUDIANTES
// ================================

function mostrarEstudiantes() {

    lista.innerHTML = "";

    const textoBusqueda = busqueda.value.toLowerCase();

    const estadoFiltro = filtro.value;


    estudiantes.forEach((estudiante, indice) => {

        // Buscar por nombre

        const coincideNombre =
            estudiante.nombre
            .toLowerCase()
            .includes(textoBusqueda);


        // Filtrar por estado

        const coincideEstado =
            estadoFiltro === "todos" ||
            estudiante.estado === estadoFiltro;


        // Si no coincide, no mostrar

        if (!coincideNombre || !coincideEstado) {
            return;
        }


        // Crear fila

        const fila = document.createElement("tr");


        // Número

        const numero = document.createElement("td");

        numero.textContent = indice + 1;


        // Nombre

        const nombre = document.createElement("td");

        nombre.textContent = estudiante.nombre;


        // Estado

        const estado = document.createElement("td");

        estado.textContent =
            obtenerTextoEstado(estudiante.estado);


        // Acciones

        const acciones = document.createElement("td");


        // Botón asistió

        const botonAsistio =
            document.createElement("button");

        botonAsistio.textContent = "Asistió";

        botonAsistio.onclick = function () {

            cambiarEstado(indice, "asistio");

        };


        // Botón faltó

        const botonFalto =
            document.createElement("button");

        botonFalto.textContent = "Faltó";

        botonFalto.onclick = function () {

            cambiarEstado(indice, "falto");

        };


        // Botón excusa

        const botonExcusa =
            document.createElement("button");

        botonExcusa.textContent = "Excusa";

        botonExcusa.onclick = function () {

            cambiarEstado(indice, "excusa");

        };



        acciones.appendChild(botonAsistio);

        acciones.appendChild(botonFalto);

        acciones.appendChild(botonExcusa);



        fila.appendChild(numero);

        fila.appendChild(nombre);

        fila.appendChild(estado);

        fila.appendChild(acciones);


        lista.appendChild(fila);

    });


    actualizarResumen();

}


// ================================
// CAMBIAR ESTADO
// ================================

function cambiarEstado(indice, nuevoEstado) {

    estudiantes[indice].estado = nuevoEstado;

    mostrarEstudiantes();

}


// ================================
// TEXTO DEL ESTADO
// ================================

function obtenerTextoEstado(estado) {

    if (estado === "asistio") {
        return "•";
    }

    if (estado === "falto") {
        return "✕";
    }

    if (estado === "excusa") {
        return "E";
    }


    return "Sin registrar";

}


// ================================
// ACTUALIZAR RESUMEN
// ================================

function actualizarResumen() {

    const total = estudiantes.length;


    const asistieron =
        estudiantes.filter(
            estudiante => estudiante.estado === "asistio"
        ).length;


    const faltaron =
        estudiantes.filter(
            estudiante => estudiante.estado === "falto"
        ).length;


    const excusas =
        estudiantes.filter(
            estudiante => estudiante.estado === "excusa"
        ).length;


    const sinRegistrar =
        estudiantes.filter(
            estudiante => estudiante.estado === "sin-registrar"
        ).length;


    document.getElementById("total").textContent =
        total;

    document.getElementById("asistieron").textContent =
        asistieron;

    document.getElementById("faltaron").textContent =
        faltaron;

    document.getElementById("excusas").textContent =
        excusas;

    document.getElementById("sinRegistrar").textContent =
        sinRegistrar;


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
// GUARDAR
// ================================

document
    .getElementById("guardar")
    .addEventListener("click", function () {

        const sinRegistrar =
            estudiantes.filter(
                estudiante =>
                    estudiante.estado === "sin-registrar"
            ).length;


        if (sinRegistrar > 0) {

            alert(
                "No se puede guardar todavía. " +
                `Hay ${sinRegistrar} estudiante(s) sin registrar.`
            );

            return;
        }


        alert(
            "✓ La asistencia se ha guardado correctamente."
        );

    });


// ================================
// INICIAR
// ================================

mostrarEstudiantes();

