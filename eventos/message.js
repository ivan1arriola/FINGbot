const { procesarComando } = require('../utils/procesarComando');
const config = require('../config');
const { detectarHackeo, guardarUsuarioSospechoso } = require('../utils/detectarHackeo');


const message = async (client, mensaje, commandMap) => {
    
    console.log('Mensaje recibido: "', mensaje.body, '" de ', mensaje.from);

    const chat = await mensaje.getChat();

    if (typeof mensaje.body !== 'string') {
        console.log('El mensaje no contiene texto.');
        return;
    }

    if (detectarHackeo(mensaje)) {
        await mensaje.reply("Se ha detectado un comportamiento sospechoso. 😠😡 Tu acceso ha sido registrado.");
        guardarUsuarioSospechoso(mensaje);
        return;
    }

    if (mensaje.body.startsWith(config.PREFIJO)) {
        procesarComando(client, mensaje, commandMap);
    }

    if (chat.isGroup) {
        console.log ('Mensaje de grupo');
    } else {
        console.log ('Mensaje privado');
    }
}

module.exports = { message };

