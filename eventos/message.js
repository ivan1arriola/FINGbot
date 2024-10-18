const { procesarComando } = require('../utils/procesarComando');
const config = require('../config');
const { manejarMensajesPrivados } = require('../manejoChats/privados');
const { manejarMensajesGrupales } = require('../manejoChats/grupales');
const { difundirMensaje } = require('../manejoChats/difusion');

const ADMINISTRADOR = '59893512699@c.us';

const procesarMensaje = async (client, mensaje, commandMap) => {
    const chat = await mensaje.getChat();

    if (mensaje.from === ADMINISTRADOR) {
        if (mensaje.body === config.PREFIJO + 'difundir') {
            await difundirMensaje(client, mensaje);
        }
        return;
    }

    if (mensaje.body.startsWith(config.PREFIJO)) {
        await procesarComando(client, mensaje, commandMap);
        return;
    }

    if (chat.isGroup) {
        await manejarMensajesGrupales(client, mensaje);
    }

    if (chat.isPrivate) {
        await manejarMensajesPrivados(client, mensaje);
    }
}

module.exports = { procesarMensaje };
