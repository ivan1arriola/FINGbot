const fs = require('fs');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');

// Ruta a la carpeta de stickers
const stickersDir = path.join(__dirname, '../stickers');

// Cargar chistes desde el archivo JSON
const jokesPath = path.join(__dirname, '../chistes.json');
const jokes = JSON.parse(fs.readFileSync(jokesPath, 'utf-8'));

// Función para enviar un chiste y un sticker
const sendJokeAndSticker = async (client, message) => {
    try {
        let msg = "No puedo hacer eso, soy un bot serio. 🤖";
        await client.sendMessage(message.from, msg);

        const wait = 5000;
        setTimeout(async () => {
            msg = "¡Pero puedo contarte un chiste! 😄";
            await client.sendMessage(message.from, msg);
        }, wait);

        setTimeout(async () => {
            const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
            const emojiJoke = `😂😂${randomJoke} 😂😂`;
            await client.sendMessage(message.from, emojiJoke);
            await sendRandomSticker(client, message);
        }, wait + 5000); // espera adicional para el chiste
    } catch (error) {
        console.error("Error al enviar chiste y sticker:", error);
        await client.sendMessage(message.from, "Ocurrió un error al intentar enviar el chiste.");
    }
};

// Función para enviar un sticker aleatorio
const sendRandomSticker = async (client, message) => {
    const files = fs.readdirSync(stickersDir);
    const stickerFiles = files.filter(file => file.endsWith('.webp')); // Filtra solo archivos WebP

    if (stickerFiles.length === 0) {
        console.log('No hay stickers disponibles para enviar.');
        return;
    }

    const randomSticker = stickerFiles[Math.floor(Math.random() * stickerFiles.length)];
    const stickerPath = path.join(stickersDir, randomSticker);
    
    // Crear un objeto MessageMedia a partir del sticker
    const stickerMedia = MessageMedia.fromFilePath(stickerPath);
    
    // Enviar el sticker como un archivo multimedia
    await client.sendMessage(message.from, stickerMedia, { sendMediaAsSticker: true });
};

// Exporta la función con la estructura adecuada
module.exports = [
    {
        name: 'gore',
        func: sendJokeAndSticker,
        info: 'Envía un chiste y un sticker',
        args: [],
    }
];
