const fs = require('fs');
const path = require('path');
const config = require('../config.js');

// Función para cargar módulos
function cargarModulos(modulos_dir) {
    let modulos = {};
    try {
        // Convertir modulos_dir a una ruta absoluta basada en la raíz del proyecto
        const modulos_dir_abs = path.resolve(__dirname, '..', modulos_dir); // '..' sube al directorio raíz

        const files = fs.readdirSync(modulos_dir_abs); // Pasar la ruta correcta
        for (const file of files) {
            try {
                const modulo = require(path.join(modulos_dir_abs, file));
                for (const comando of modulo) {
                    modulos[comando.name] = comando;
                    modulos[comando.name].args_size = (comando.args) ? comando.args.length : 0;
                    modulos[comando.name].min_args = (comando.args) ? comando.args.filter(arg => arg.required).length : 0;
                }
            } catch (error) {
                console.error(`No se pudo cargar el módulo ${file}: ${error.message}`); // Cambiado a console.error para errores
            }
        }
    } catch (error) {
        console.error('Ocurrió un error cargando los módulos: ', error.message); // Cambiado a console.error para errores
    }
    return modulos;
}

// Funciones para manejo de comandos y ayuda
function usage(comando) {
    const formatearArgumento = argumento => argumento.required ? `*<${argumento.name}>*` : `*[${argumento.name}]*`;
    return `*${config.PREFIJO}${comando.name}* ${comando.args ? comando.args.map(arg => formatearArgumento(arg)).join(' ') + ' ' : ''}`;
}

function listParameters(comando) {
    if (!comando.args || comando.args.length < 1) return "";
    
    const formatearParametro = arg => `> *${arg.name}* - ${arg.info}`;
    return `*Parámetros:*\n${comando.args.map(arg => formatearParametro(arg)).join('\n')}`;
}

module.exports = { cargarModulos, usage, listParameters };

// test 
//console.log(cargarModulos('../modulos'));
