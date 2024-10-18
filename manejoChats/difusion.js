// difusion.js

const config = require('../config');
const { obtenerComando } = require('../utils/procesarComando');

const difundirMensaje = async (client, message) => {
    const command = obtenerComando(message.body);
    const mensaje = message.body.slice(config.COMANDO_PREFIJO.length + command.length).trim();

    // Advertir por consola que se llamo al comando de difusion con muchos emojis
    console.log('📢 Difundir mensaje: ' + mensaje );

    const chats = await client.getChats();

    // Filtrar chats grupales
    const grupos = chats.filter(chat => chat.isGroup);

    // Si no hay chats grupales
    if (grupos.length === 0) {
        await message.reply('No hay chats grupales');
        return;
    }

    // Enviar mensaje a los ultimos 5 chats grupales
    for (let i = 0; i < 5 && i < grupos.length; i++) {
        const grupo = grupos[i];
        await grupo.sendMessage(mensaje);
    }
}

module.exports = {
    difundirMensaje,
};