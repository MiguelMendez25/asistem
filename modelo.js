
// ================================
// ESTUDIANTES
// ================================

const estudiantes = [

    {
        id: "est-11-3-001",
        numero: 1,
        nombre: "AGUIRRE VEGA SARAY SOFIA"
    },

    {
        id: "est-11-3-002",
        numero: 2,
        nombre: "ALDANA RUBIO ANA VICTORIA"
    },

    {
        id: "est-11-3-003",
        numero: 3,
        nombre: "BAQUERO FLOREZ NATALIA CAROLINA"
    },

    {
        id: "est-11-3-004",
        numero: 4,
        nombre: "BARAZARTE MARTINEZ STEFANY"
    },

    {
        id: "est-11-3-005",
        numero: 5,
        nombre: "BONILLA SERPA SANTIAGO JESUS"
    },

    {
        id: "est-11-3-006",
        numero: 6,
        nombre: "CALLE ESCALONA PAOLA CRISTINA DEL CARMEN"
    },

    {
        id: "est-11-3-007",
        numero: 7,
        nombre: "CASTRO MESTRA SHEYLA"
    },

    {
        id: "est-11-3-008",
        numero: 8,
        nombre: "CASTRO SALGADO VERONICA"
    },

    {
        id: "est-11-3-009",
        numero: 9,
        nombre: "CLARA PEÑALOZA DANIEL ALEJANDRO"
    },

    {
        id: "est-11-3-010",
        numero: 10,
        nombre: "CONTRERAS BETANCUR KAROL LUCIA"
    },

    {
        id: "est-11-3-011",
        numero: 11,
        nombre: "DIAZ HURTADO ALEJANDRA"
    },

    {
        id: "est-11-3-012",
        numero: 12,
        nombre: "GUERRA ORTIZ SEBASTIAN"
    },

    {
        id: "est-11-3-013",
        numero: 13,
        nombre: "GUZMAN GUERRA ALEJANDRA MARIA"
    },

    {
        id: "est-11-3-014",
        numero: 14,
        nombre: "HERNANDEZ BARRAYAN LUIS ANGEL"
    },

    {
        id: "est-11-3-015",
        numero: 15,
        nombre: "HERNANDEZ HERNANDEZ ALEXANDER JOSE"
    },

    {
        id: "est-11-3-016",
        numero: 16,
        nombre: "HOYOS GONZALEZ ISSAMAR"
    },

    {
        id: "est-11-3-017",
        numero: 17,
        nombre: "HUMANEZ AGUIRRE NICOLE"
    },

    {
        id: "est-11-3-018",
        numero: 18,
        nombre: "LARA LAZARO ALEX JOSÉ"
    },

    {
        id: "est-11-3-019",
        numero: 19,
        nombre: "LARA MERCADO MARIANGEL"
    },

    {
        id: "est-11-3-020",
        numero: 20,
        nombre: "LARA MERCADO MOISES"
    },

    {
        id: "est-11-3-021",
        numero: 21,
        nombre: "LOBO OTERO TANIA"
    },

    {
        id: "est-11-3-022",
        numero: 22,
        nombre: "LOZANO PEÑATA ANALIA"
    },

    {
        id: "est-11-3-023",
        numero: 23,
        nombre: "MACEA VEGA SAMUEL ESTEBAN"
    },

    {
        id: "est-11-3-024",
        numero: 24,
        nombre: "MARRUGO ESTRADA LINDA MICHELLE"
    },

    {
        id: "est-11-3-025",
        numero: 25,
        nombre: "MARSIGLIA ARRIETA VICTORIA"
    },

    {
        id: "est-11-3-026",
        numero: 26,
        nombre: "MARTINEZ RAMOS VALENTINA"
    },

    {
        id: "est-11-3-027",
        numero: 27,
        nombre: "MENDEZ DIAZ MIGUEL ANGEL"
    },

    {
        id: "est-11-3-028",
        numero: 28,
        nombre: "MONTIEL BARRIOS ELIZABETH"
    },

    {
        id: "est-11-3-029",
        numero: 29,
        nombre: "MORENO GUERRA MARIA CAMILA"
    },

    {
        id: "est-11-3-030",
        numero: 30,
        nombre: "NARVAEZ VERGARA MANUEL ALEJANDRO"
    },

    {
        id: "est-11-3-031",
        numero: 31,
        nombre: "OVIEDO DIAZ SAMUEL SAID"
    },

    {
        id: "est-11-3-032",
        numero: 32,
        nombre: "SABIE VALERO JHASETH JOSE"
    },

    {
        id: "est-11-3-033",
        numero: 33,
        nombre: "SALGADO RAMOS GABRIELA"
    },

    {
        id: "est-11-3-034",
        numero: 34,
        nombre: "SANCHEZ CASTILLO JUNIOR ALFONSO"
    },

    {
        id: "est-11-3-035",
        numero: 35,
        nombre: "SANTANA ACEVEDO MARIANGEL"
    },

    {
        id: "est-11-3-036",
        numero: 36,
        nombre: "TIRADO PANTOJA STHEFANNY DEL CARMEN"
    },

    {
        id: "est-11-3-037",
        numero: 37,
        nombre: "VASQUEZ TIRADO SALMA"
    },

    {
        id: "est-11-3-038",
        numero: 38,
        nombre: "ZABALA QUINTERO CARLOS EDUARDO"
    }

];



// ================================
// ESTADOS DE ASISTENCIA
// ================================

// Sin registrar es el estado técnico inicial; solo los oficiales tienen botón.
// texto es el nombre completo; textoBoton solo se indica cuando se abrevia.
// El filtro, el resumen y las acciones comparten esta definición.
// simbolo solo representa el estado en la ficha institucional; no cambia el valor guardado.
const estadosAsistencia = [
    { valor: "sin-registrar", texto: "Sin registrar", oficial: false },
    { valor: "asistio", texto: "Asistió", simbolo: ".", oficial: true },
    { valor: "falto-con-excusa", texto: "Faltó con excusa", textoBoton: "Con excusa", simbolo: "E", oficial: true },
    { valor: "falto-sin-excusa", texto: "Faltó sin excusa", textoBoton: "Sin excusa", simbolo: "X", oficial: true },
    {
        valor: "reportado",
        simbolo: "A",
        texto: "Reportado",
        oficial: true,
        descripcion: "Estuvo presente anteriormente en la institución, pero no ingresó a una clase posterior."
    },
    { valor: "llego-tarde", texto: "Llegó tarde", textoBoton: "Tarde", simbolo: "R", oficial: true }
];

const estadosOficiales = estadosAsistencia.filter(estado => estado.oficial);

// Catálogo único para el selector, la vista semanal y las celdas editables del Excel.
const catalogoAsignaturas = [
    { id: "ciencias-politicas", nombre: "Ciencias Políticas", abreviatura: "POL" },
    { id: "sociales", nombre: "Sociales", abreviatura: "SOC" },
    { id: "pensamiento-variacional", nombre: "Pensamiento variacional", abreviatura: "PV" },
    { id: "literatura", nombre: "Literatura", abreviatura: "LIT" },
    { id: "ingles", nombre: "Inglés", abreviatura: "ING" },
    { id: "quimica", nombre: "Química", abreviatura: "QUI" },
    { id: "produccion-textual", nombre: "Producción textual", abreviatura: "PT" },
    { id: "educacion-religiosa", nombre: "Educación Religiosa", abreviatura: "ER" },
    { id: "biologia", nombre: "Biología", abreviatura: "BIO" },
    { id: "tecnologia", nombre: "Tecnología", abreviatura: "TEC" },
    { id: "educacion-etica", nombre: "Educación Ética", abreviatura: "EE" },
    { id: "geometria-estadistica", nombre: "Geometría y Estadística", abreviatura: "GE" },
    { id: "educacion-fisica", nombre: "Educación Física", abreviatura: "EF" },
    { id: "danza", nombre: "Danza", abreviatura: "DAN" },
    { id: "fisica", nombre: "Física", abreviatura: "FIS" },
    { id: "musica", nombre: "Música", abreviatura: "MUS" },
    { id: "artes-plasticas", nombre: "Artes Plásticas", abreviatura: "AP" }
];

function asignaturaEnFicha(ficha, fecha, hora) {
    const id = ficha.asignaturas?.[fecha]?.[hora];
    return catalogoAsignaturas.find(asignatura => asignatura.id === id) || null;
}

function asignarAsignatura(id) {
    if (!sesionActiva) throw new Error("No hay una sesión activa.");
    if (id !== "" && !catalogoAsignaturas.some(asignatura => asignatura.id === id)) {
        throw new Error("Asignatura desconocida.");
    }
    const { ficha, fecha, hora } = sesionActiva;
    if ((asignaturaEnFicha(ficha, fecha, hora)?.id || "") === id) return;
    if (id === "") {
        delete ficha.asignaturas[fecha][hora];
        if (!Object.keys(ficha.asignaturas[fecha]).length) delete ficha.asignaturas[fecha];
    } else {
        ficha.asignaturas ??= {};
        ficha.asignaturas[fecha] ??= {};
        ficha.asignaturas[fecha][hora] = id;
    }
    // Materias y asistencias comparten el aviso de cambios pendientes de llevar a Excel.
    ficha.revision = (ficha.revision || 0) + 1;
}

function leyendaAsignaturas() {
    return catalogoAsignaturas.map(a => `${a.abreviatura} = ${a.nombre}`).join(" | ");
}

// Fechas civiles: se opera en UTC y se devuelve texto, nunca una fecha local convertida.
function fechaCivil(texto) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) throw new Error("Fecha inválida");
    const fecha = new Date(texto + "T12:00:00Z");
    if (!Number.isFinite(fecha.getTime()) || fecha.toISOString().slice(0, 10) !== texto) {
        throw new Error("Fecha inválida");
    }
    return fecha;
}

function sumarDias(texto, cantidad) {
    const fecha = fechaCivil(texto);
    fecha.setUTCDate(fecha.getUTCDate() + cantidad);
    const resultado = fecha.toISOString().slice(0, 10);
    fechaCivil(resultado);
    return resultado;
}

function lunesDeSemana(texto) {
    return sumarDias(texto, -((fechaCivil(texto).getUTCDay() + 6) % 7));
}

function diasDeSemana(lunes) {
    return Array.from({ length: 5 }, (_, i) => sumarDias(lunes, i));
}

const cursoActual = { id: "curso-11-3", nombre: "11°3" };
const VERSION_FORMATO = 1;
let espacioTrabajo = { versionFormato: VERSION_FORMATO, fichas: [] };
let sesionActiva = null;

function abrirSesion(fecha, hora) {
    const lunes = lunesDeSemana(fecha);
    if (!diasDeSemana(lunes).includes(fecha) || !Number.isInteger(hora) || hora < 1 || hora > 7) {
        throw new Error("Selecciona un día de lunes a viernes y una hora del 1 al 7.");
    }
    const ficha = obtenerFicha(lunes);
    sesionActiva = { ficha, fecha, hora };
}

function obtenerFicha(lunes) {
    if (lunesDeSemana(lunes) !== lunes) throw new Error("La ficha debe comenzar en lunes.");
    let ficha = espacioTrabajo.fichas.find(f => f.curso.id === cursoActual.id && f.lunes === lunes);
    if (!ficha) {
        ficha = {
            versionFormato: VERSION_FORMATO,
            curso: { ...cursoActual },
            lunes,
            estudiantes: estudiantes.map(({ id, nombre }) => ({ id, nombre })),
            marcaciones: {},
            asignaturas: {}
        };
        espacioTrabajo.fichas.push(ficha);
    }
    return ficha;
}

function estadoDe(id) {
    if (!sesionActiva) return "sin-registrar";
    const { ficha, fecha, hora } = sesionActiva;
    return ficha.marcaciones[fecha]?.[hora]?.[id] || "sin-registrar";
}

function asignarEstado(id, estado) {
    if (!sesionActiva || !estudiantes.some(e => e.id === id)) throw new Error("Estudiante o sesión inválidos");
    if (!estadosAsistencia.some(e => e.valor === estado)) throw new Error("Estado inválido");
    const { ficha, fecha, hora } = sesionActiva;
    if (estadoDe(id) === estado) return;
    ficha.revision = (ficha.revision || 0) + 1;
    if (estado === "sin-registrar") {
        const registros = ficha.marcaciones[fecha]?.[hora];
        if (registros) {
            delete registros[id];
            if (!Object.keys(registros).length) delete ficha.marcaciones[fecha][hora];
            if (!Object.keys(ficha.marcaciones[fecha]).length) delete ficha.marcaciones[fecha];
        }
        return;
    }
    ficha.marcaciones[fecha] ??= {};
    ficha.marcaciones[fecha][hora] ??= {};
    ficha.marcaciones[fecha][hora][id] = estado;
}

// Valida el documento completo antes de sustituir el espacio de trabajo.
// Esta misma estructura servirá para una ficha Excel por curso y lunes.
function validarBorrador(datos) {
    const objeto = valor => valor !== null && typeof valor === "object" && !Array.isArray(valor);
    const exigir = condicion => { if (!condicion) throw new Error("Borrador dañado o de formato incompatible"); };
    exigir(objeto(datos) && datos.versionFormato === VERSION_FORMATO && Array.isArray(datos.fichas));
    const claves = new Set();
    for (const ficha of datos.fichas) {
        exigir(objeto(ficha) && ficha.versionFormato === VERSION_FORMATO);
        exigir(ficha.revision === undefined || (Number.isSafeInteger(ficha.revision) && ficha.revision >= 0));
        exigir(ficha.revisionExcel === undefined || (Number.isSafeInteger(ficha.revisionExcel) && ficha.revisionExcel >= 0 && ficha.revisionExcel <= (ficha.revision || 0)));
        exigir(ficha.curso?.id === cursoActual.id && ficha.curso.nombre === cursoActual.nombre);
        exigir(lunesDeSemana(ficha.lunes) === ficha.lunes);
        const clave = ficha.curso.id + "/" + ficha.lunes;
        exigir(!claves.has(clave));
        claves.add(clave);
        exigir(Array.isArray(ficha.estudiantes) && ficha.estudiantes.length === estudiantes.length);
        ficha.estudiantes.forEach((e, i) => exigir(e?.id === estudiantes[i].id && e.nombre === estudiantes[i].nombre));
        // Campo opcional: un borrador anterior sin asignaturas sigue siendo válido, sin migrar asistencias.
        if (ficha.asignaturas !== undefined) {
            exigir(objeto(ficha.asignaturas));
            for (const [fecha, horas] of Object.entries(ficha.asignaturas)) {
                exigir(diasDeSemana(ficha.lunes).includes(fecha) && objeto(horas));
                for (const [hora, id] of Object.entries(horas)) {
                    exigir(/^[1-7]$/.test(hora) && catalogoAsignaturas.some(a => a.id === id));
                }
            }
        }
        exigir(objeto(ficha.marcaciones));
        for (const [fecha, horas] of Object.entries(ficha.marcaciones)) {
            exigir(diasDeSemana(ficha.lunes).includes(fecha) && objeto(horas));
            for (const [hora, registros] of Object.entries(horas)) {
                exigir(/^[1-7]$/.test(hora) && objeto(registros));
                for (const [id, estado] of Object.entries(registros)) {
                    exigir(estudiantes.some(e => e.id === id) && estadosOficiales.some(e => e.valor === estado));
                }
            }
        }
    }
    return datos;
}
