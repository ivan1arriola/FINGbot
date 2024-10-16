// sticker.js

// Importar módulos
const sendRandomSticker = require('../utils/sendRandomSticker');

// Procesar mensaje
const sticker = async (client, mensaje) => {
    sendRandomSticker("stickers", client, mensaje);
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
