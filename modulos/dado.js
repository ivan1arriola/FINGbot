const fs = require('fs');
const path = require('path');
const sendRandomSticker = require('../utils/sendRandomSticker');

// Ruta a la carpeta de media
const mediaDir = path.join(__dirname, '../dados');

// Función para obtener la cantidad de dados a enviar
function obtenerArgumentos(body) {
    return body.trim().split(" ").slice(1).filter(text => text !== '');
}

async function sendDadoSticker(client, message, args) {
    try {
        // Obtener los argumentos del mensaje
        const args = obtenerArgumentos(message.body); // Extraer argumentos
        const cantidad = (args.length > 0 && !isNaN(args[0]) && args[0] !== '') 
            ? Math.min(parseInt(args[0]), 6)  // Máximo 6 dados
            : 1; // Cantidad de dados (por defecto 1)

        // Enviar la cantidad de stickers solicitados
        for (let i = 0; i < cantidad; i++) {
            await sendRandomSticker(mediaDir, client, message);
        }
    } catch (error) {
        console.error('Error al enviar el dado:', error);
        await client.sendMessage(message.from, 'Hubo un error al enviar el dado.');
    }
}

module.exports = [
    { name: 'dado', func: sendDadoSticker, info: 'Envía un sticker aleatorio de un dado (por defecto 1, máx 6)', args: [{ name: 'n', info: 'Cantidad de dados' }] }
];
