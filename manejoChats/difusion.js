// difusion.js

const config = require('../config');
const { obtenerComando } = require('../utils/procesarComando');

const difundirMensaje = async (client, message) => {
    console.log('📢 Difundir mensaje');
    const command = obtenerComando(message.body);
    const mensaje = message.body.slice(config.PREFIJO.length + command.length).trim();

    // Advertir por consola que se llamó al comando de difusión con muchos emojis
    console.log('📢 Difundir mensaje: ' + mensaje);

    try {
        const chats = await client.getChats();

        // Filtrar chats grupales
        const grupos = chats.filter(chat => chat.isGroup);

        // Si no hay chats grupales
        if (grupos.length === 0) {
            await message.reply('No hay chats grupales');
            return;
        }

        // Enviar mensaje a los últimos 5 chats grupales
        for (let i = 0; i < 5 && i < grupos.length; i++) {
            const grupo = grupos[i];
            try {
                await grupo.sendMessage(mensaje);
                console.log(`✅ Mensaje enviado al grupo: ${grupo.name}`);
            } catch (error) {
                console.error(`Error al enviar mensaje al grupo ${grupo.name}: `, error.message);
            }
        }
    } catch (error) {
        console.error('Error al obtener chats: ', error.message);
        await message.reply('Ocurrió un error al intentar difundir el mensaje.');
    }
};

module.exports = {
    difundirMensaje,
};
