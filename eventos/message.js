const { procesarComando } = require('../utils/procesarComando');
const config = require('../config');

const ADMINISTRADOR = '59893512699@c.us';


const procesarMensaje = async (client, mensaje, commandMap) => {
    const chat = await mensaje.getChat();
    
    if (chat.isGroup) {
        // Mensaje de [nombre] en [nombre del grupo] : [mensaje]
        console.log ('Mensaje de ' + mensaje.from + ' en ' + chat.name + ' : ' + mensaje.body); 
    } else {
        // Mensaje privado de [nombre] : [mensaje]
        console.log ('Mensaje privado de ' + mensaje.from + ' : ' + mensaje.body);
        if (mensaje.from !== ADMINISTRADOR) {
            await client.sendMessage(ADMINISTRADOR, `Mensaje privado de ${mensaje.from}: ${mensaje.body}`);
            procesarComando(client, mensaje, commandMap);
        } else {
            console.log('Mensaje del administrador');
            if (mensaje.body.startsWith("!difundir")) {
                const mensajeDifundir = mensaje.body.slice(9);
                if (mensajeDifundir === '') {
                    await client.sendMessage(ADMINISTRADOR, 'No se ha ingresado un mensaje para difundir.');
                    return;
                }
                const chats = await client.getChats();
                chats.forEach(async chat => {
                    if (chat.isGroup) {
                        await chat.sendMessage(mensajeDifundir);
                    }
                });
            }

        }
    } 

    if (typeof mensaje.body !== 'string') {
        console.log('El mensaje no contiene texto.');
        return;
    }

    if (mensaje.body.startsWith(config.PREFIJO)) {
        procesarComando(client, mensaje, commandMap);
    }

    
}

module.exports = { procesarMensaje };

