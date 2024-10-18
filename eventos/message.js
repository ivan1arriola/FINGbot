const { procesarComando } = require('../utils/procesarComando');
const config = require('../config');
const {manejarMensajesPrivados} = require('../manejoChats/privados');
const {manejarMensajesGrupales} = require('../manejoChats/grupales');
const {difundirMensaje} = require('../manejoChats/difusion');

const ADMINISTRADOR = '59893512699@c.us';

const procesarMensaje = async (client, mensaje, commandMap) => {
    const chat = await mensaje.getChat();

    console.log(`Mensaje recibido de ${mensaje.from}: ${mensaje.body}`);

    if (mensaje.from === ADMINISTRADOR) {
        console.log('Mensaje del administrador');
        if (mensaje.body === config.COMANDO_PREFIJO + 'difundir') {
            await difundirMensaje(client, mensaje);
        }
        return;
    }

    if (mensaje.body.startsWith(config.COMANDO_PREFIJO)) {
        console.log('Mensaje de comando');
        await procesarComando(client, mensaje, commandMap);
        return;
    }

    if (chat.isGroup) {
        console.log('Mensaje de grupo');
        await manejarMensajesGrupales(client, mensaje);
    }

    if (chat.isPrivate) {
        console.log('Mensaje privado');
        await manejarMensajesPrivados(client, mensaje);
    }

}   

module.exports = { procesarMensaje };
