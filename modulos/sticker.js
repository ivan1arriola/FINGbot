// sticker.js

// Importar módulos
const sendRandomSticker = require('../utils/sendRandomSticker');

// Procesar mensaje
const sticker = async (client, mensaje) => {
    try {
        await sendRandomSticker("stickers", client, mensaje);
    } catch (error) {
        console.error('Error al enviar el sticker:', error.message);
        await client.sendMessage(mensaje.from, '❌ *Hubo un error al intentar enviar el sticker. Intenta nuevamente.*');
    }
}

// Exporta la función con la estructura adecuada
module.exports = [
    {
        name: 'sticker',
        func: sticker,
        info: 'Envía un sticker aleatorio.',
        args: [],
    }
];
