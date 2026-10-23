const { createServer } = require("node:http");
const { abrirBaseDatos, rutaBaseDatos } = require("./database");

function iniciarServidor() {
    const puertoTexto = process.env.PORT ?? "3000";
    const puerto = Number(puertoTexto);

    if (!/^\d+$/.test(puertoTexto) || !Number.isInteger(puerto) || puerto < 1 || puerto > 65535) {
        console.error("No se pudo iniciar Asistem: PORT debe ser un número entero entre 1 y 65535.");
        process.exitCode = 1;
        return;
    }

    let baseDatos;

    try {
        baseDatos = abrirBaseDatos();
    } catch (error) {
        console.error(`No se pudo abrir SQLite en ${rutaBaseDatos}.`);
        console.error("Comprueba que usas Node.js 24 y que la carpeta de datos permite lectura y escritura.");
        console.error(`Detalle: ${error.message}`);
        process.exitCode = 1;
        return;
    }

    function cerrarBaseDatos() {
        if (!baseDatos) return;

        try {
            baseDatos.close();
        } catch (error) {
            console.error(`No se pudo cerrar SQLite: ${error.message}`);
            process.exitCode = 1;
        } finally {
            baseDatos = null;
        }
    }

    const servidor = createServer((solicitud, respuesta) => {
        // Los parámetros de consulta no cambian la ruta solicitada.
        const ruta = solicitud.url.split("?")[0];

        respuesta.setHeader("Content-Type", "application/json; charset=utf-8");

        if (solicitud.method === "GET" && ruta === "/health") {
            respuesta.writeHead(200);
            respuesta.end(JSON.stringify({ status: "ok", service: "asistem" }));
            return;
        }

        respuesta.writeHead(404);
        respuesta.end(JSON.stringify({ error: "Ruta no encontrada" }));
    });

    servidor.on("error", error => {
        if (error.code === "EADDRINUSE") {
            console.error(`No se pudo iniciar Asistem: el puerto ${puerto} ya está ocupado. Cierra la otra instancia o elige otro PORT.`);
        } else if (error.code === "EACCES" || error.code === "EPERM") {
            console.error(`No se pudo iniciar Asistem: Windows no permite escuchar en el puerto ${puerto}. Prueba otro PORT.`);
        } else {
            console.error(`No se pudo iniciar el servidor: ${error.message}`);
        }

        cerrarBaseDatos();
        process.exitCode = 1;
    });

    servidor.on("close", cerrarBaseDatos);

    let cerrando = false;

    function detenerServidor() {
        if (cerrando) return;
        cerrando = true;

        servidor.close(() => {
            console.log("Servidor Asistem detenido.");
        });
    }

    process.on("SIGINT", detenerServidor);
    process.on("SIGTERM", detenerServidor);

    servidor.listen(puerto, "0.0.0.0", () => {
        console.log(`Asistem escuchando en 0.0.0.0:${puerto}`);
        console.log(`Prueba local: http://localhost:${puerto}/health`);
        console.log(`SQLite: ${rutaBaseDatos}`);
        console.log("Pulsa Ctrl+C para detener el servidor.");
    });
}

iniciarServidor();
