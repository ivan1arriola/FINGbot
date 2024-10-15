const fs = require('fs');
const fuzzysort = require('fuzzysort');

// Enlace al PDF del calendario de parciales
const calendarioURL = "https://www.fing.edu.uy/sites/default/files/2024-10/Calendario%202dos.%20Parciales%202do.%20Semestre%202024.pdf";

// Leer el archivo generado que contiene las fechas en formato JSON
const fechas = JSON.parse(fs.readFileSync('fechasParciales.json', 'utf-8'));


const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio", 
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

/** 
 * @param {string} dateTime
 * @returns {string}
 */
function fechaLegible(dateTime) {
    let [fecha, time] = dateTime.split("T");
    let [año, mes, día] = fecha.split("-");
    let [hora, minuto] = time.split(":");
    mes = meses[mes - 1]; // Convierte el mes de número a nombre
    return `${parseInt(día)} de ${mes} a las ${hora}:${minuto}`;
}

/** 
 * @param {string} dateTime
 * @returns {number}
 */
function díasHastaParcial(dateTime) {
    let now = Date.now(); // Fecha actual
    let parcial = Date.parse(dateTime); // Fecha del parcial
    return Math.floor((parcial - now) / 86400000); // Diferencia en días (ms/día)
}

/**
 * @param {object} client
 * @param {object} message
 * @param {object} args
 */
async function consultarParcial(client, message, args) {
    try {

        message.body = message.body.toLowerCase();

        // Normalizar el comando si es un alias
        if (message.body === "!consultarparcial cdiv") {
            message.body = "!consultarparcial calculo una variable";
        }

        console.log("Consultando fecha de parcial...");
        console.log("Mensaje:", message.body);
        console.log("args:", args);

        // Extraer el nombre del curso del mensaje
        let match = /!consultarparcial ([a-zA-Z0-9 ]+)/.exec(message.body);
        if (!match || match.length < 2) {
            await message.reply("No pude reconocer el curso. Asegúrate de escribir el nombre correctamente.");
            return;
        }

        let curso = match[1].trim();

        // Realizar la búsqueda difusa del curso
        let res = fuzzysort.go(curso, Object.keys(fechas), {
            threshold: -1000,  // Devuelve solo coincidencias relevantes
            limit: 1,          // Solo devuelve la mejor coincidencia
        });

        if (res.length === 0) {
            await message.reply(`No se encontró el curso ${curso}.`);
            return;
        }

        // Obtener la fecha del parcial
        let fecha_legible = fechaLegible(fechas[res[0].target]);
        let dias_restantes = díasHastaParcial(fechas[res[0].target]);

        // Responder con la información del parcial
        await message.reply(`El parcial de ${res[0].target} es el ${fecha_legible} y faltan ${dias_restantes} días.`);
    } catch (error) {
        console.error("Error en consultarParcial:", error.message);
        await message.reply("Ocurrió un error al procesar tu solicitud. Intenta nuevamente.");
    }
}

// Exporta la función con la estructura adecuada
module.exports = [
    {
        name: 'consultarparcial',
        func: consultarParcial,
        info: 'Consulta la fecha de un parcial de un curso específico.',
        args: [{name:'curso',info:'Curso a consultar',required:true}],
        min_args:1
    }
];
