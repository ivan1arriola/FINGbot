// tomaso.js

const fs = require('fs');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');

// Ruta a la carpeta de media
const mediaDir = path.join(__dirname, '../tomaso');

async function sendRandomSticker(client, message, args) {
    try {
        // Leer archivos de la carpeta media
        const files = fs.readdirSync(mediaDir);
        
        // Filtrar solo imágenes válidas (webp)
        const mediaFiles = files.filter(file => file.endsWith('.webp'));

        if (mediaFiles.length === 0) {
            await client.sendMessage(message.from, 'No se encontraron imágenes disponibles.');
            return;
        }

        // Seleccionar un archivo de media al azar
        const randomMedia = mediaFiles[Math.floor(Math.random() * mediaFiles.length)];
        const mediaPath = path.join(mediaDir, randomMedia);

        // Crear un objeto MessageMedia a partir del archivo webp
        const media = MessageMedia.fromFilePath(mediaPath);
        
        // Enviar la imagen webp como sticker
        await client.sendMessage(message.from, media, { sendMediaAsSticker: true });

        // Enviar un mensaje adicional (opcional)
        await client.sendMessage(message.from, 'Miau 🐱');
    } catch (error) {
        console.error('Error al enviar la imagen:', error);
        await client.sendMessage(message.from, 'Hubo un error al enviar la imagen.');
    }
}

module.exports = [
  {name: 'tomaso', func: sendRandomSticker, info: 'Envía un sticker aleatorio de un gato', args: []}
];
