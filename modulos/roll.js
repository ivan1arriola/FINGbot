const child_process = require('child_process');
const fs = require('fs');
const fuzzysort = require('fuzzysort');
const WAWebJS = require('whatsapp-web.js');




/**
 * @param {WAWebJS.client} client
 * @param {WAWebJS.Message} message
 * @param {object} args
 */
async function roll(client, message, args) {
    let match = /!roll (.+)/.exec(message.body)[1];
    if (match.length < 2) {
        message.reply("No se pudo ejecutar la tirada");
        return;
    }
    const troll = child_process.spawn(`./troll`);
    troll.stdin.write(match);
    troll.stdin.end();
    let msg = "";
    troll.stdout.on("data", data => {
        msg += data;
    });
    troll.on('close', x_ => {
        message.reply(`El resultado de la tirada es: ${msg}`);
    })
}

// Exporta la función con la estructura adecuada
module.exports = [
    {
        name: 'roll',
        func: roll,
        info: 'Tirada de dados.',
        args: [{name:'expresión',info:'Expresión de la tirada',required:true}],
        min_args:1
    }
];
