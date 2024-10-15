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
    const match = /!roll (.+)/.exec(message.body);
    
    // Verificamos si hay coincidencias antes de acceder al índice 1
    if (!match || match.length < 2) {
        message.reply("No se pudo ejecutar la tirada. Asegúrate de ingresar el comando correctamente.");
        return;
    }

    const expression = match[1];  // Obtiene la expresión de la tirada
    const troll = child_process.spawn(`./troll`);
    
    troll.stdin.write(expression);
    troll.stdin.end();
    
    let msg = "";
    troll.stdout.on("data", data => {
        msg += data;
    });

    troll.on('close', () => {
        message.reply(`El resultado de la tirada es: ${msg}`);
    });
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
