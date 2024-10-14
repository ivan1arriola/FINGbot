const fs = require('fs')
const fuzzysort = require('fuzzysort')
const axios = require('axios');
const cheerio = require('cheerio');
const { MessageMedia } = require('whatsapp-web.js');
const fechas = JSON.parse(fs.readFileSync('fechasParciales.json'));

const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
];

/** 
 * @param {string} dateTime
 * @returns {string}
 * 
*/
function fechaLegible(dateTime) {
    let [fecha, time] = dateTime.split("T");
    let [año, mes, día] = fecha.split("-");
    let [hora, minuto, segundo] = time.split(":");
    mes = meses[mes-1];
    return `${parseInt(día)} de ${mes} a las ${hora}:${minuto}`
}

async function cuandoParcial(client, message) {
    if (message.body.includes("cdiv")) {
        message.body = "!cuando calculo una variable";
    }
    let curso = /!cuando ([a-zA-Z0-9 ]+)/.exec(message.body)[1];
    let res = fuzzysort.go(curso, Object.keys(fechas), {
        threshold: 0,    // Don't return matches worse than this
        limit: 0,        // Don't return more results than this
        all: false,      // If true, returns all results for an empty search
        key: null,       // For when targets are objects (see its example usage)
        keys: null,      // For when targets are objects (see its example usage)
        scoreFn: null,   // For use with `keys` (see its example usage)
        })

    if (res.length === 0) {
        await message.reply(`No se encontró el curso ${curso}`);
        return;
    }
    await message.reply(`El parcial de ${res[0].target} es el ${fechaLegible(fechas[res[0].target])}`)
}
module.exports = cuandoParcial;