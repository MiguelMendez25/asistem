const { mkdirSync, existsSync, statSync } = require("node:fs");
const { join } = require("node:path");

// La ruta no depende de la carpeta desde la que se ejecute Node.js.
const directorioDatos = join(__dirname, "data");
const rutaBaseDatos = join(directorioDatos, "asistem.sqlite");

function abrirBaseDatos() {
    const { DatabaseSync } = require("node:sqlite");

    mkdirSync(directorioDatos, { recursive: true });
    const estaVacia = !existsSync(rutaBaseDatos) || statSync(rutaBaseDatos).size === 0;
    const baseDatos = new DatabaseSync(rutaBaseDatos);

    try {
        if (estaVacia) {
            // Escribe la estructura mínima de SQLite, sin crear tablas ni registros.
            baseDatos.exec("VACUUM");
        }

        // Comprueba que un archivo existente sea una base SQLite legible.
        baseDatos.prepare("PRAGMA schema_version").get();
        return baseDatos;
    } catch (error) {
        baseDatos.close();
        throw error;
    }
}

module.exports = { abrirBaseDatos, rutaBaseDatos };
