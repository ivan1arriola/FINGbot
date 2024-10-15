// dado.js

const fs = require('fs');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');
const sendRandomSticker = require('../utils/sendRandomSticker');


// Ruta a la carpeta de media
const mediaDir = path.join(__dirname, '../dados');

async function sendDadoSticker (client, message, args) {
    try {
        // Obtener dir de dados
        await sendRandomSticker(mediaDir, client, message);

        // Enviar un mensaje adicional (opcional)
        await client.sendMessage(message.from, '🎲');
    } catch (error) {
        console.error('Error al enviar la imagen:', error);
        await client.sendMessage(message.from, 'Hubo un error al enviar la imagen.');
    }
}

module.exports = [
    {name: 'dado', func: sendDadoSticker, info: 'Envía un sticker aleatorio de un dado', args: []}
    ];
