// sendRandomSticker.js
const fs = require('fs');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');

// Función para enviar un sticker aleatorio
const sendRandomSticker = async (dir, client, message) => {
    const files = fs.readdirSync(dir);
    const stickerFiles = files.filter(file => file.endsWith('.webp')); // Filtra solo archivos WebP

    if (stickerFiles.length === 0) {
        console.log('No hay stickers disponibles para enviar.');
        return;
    }

    const randomSticker = stickerFiles[Math.floor(Math.random() * stickerFiles.length)];
    const stickerPath = path.join(dir, randomSticker);
    
    // Crear un objeto MessageMedia a partir del sticker
    const stickerMedia = MessageMedia.fromFilePath(stickerPath);
    
    // Enviar el sticker como un archivo multimedia
    await client.sendMessage(message.from, stickerMedia, { sendMediaAsSticker: true });
};

// Exporta la función
module.exports = sendRandomSticker;