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
        } else {
            console.log('Mensaje del administrador');
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

