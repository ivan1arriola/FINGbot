const fs = require('fs');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');
const joke = require('give-me-a-joke');

// Ruta a la carpeta de stickers
const stickersDir = path.join(__dirname, '../stickers');

// Función para enviar un chiste
const sendJoke = async (client, message) => {
    joke.getJoke('DAD', 'random', (jokeText) => {
        const emojiJoke = `😂😂 ¡Aquí tienes un chiste! ${jokeText} 😂😂`;
        client.sendMessage(message.from, emojiJoke);
        sendRandomSticker(client, message);
    });
};

// Función para enviar un chiste y luego un sticker
const goreJoke = async (client, message) => {
    let msg = "No puedo hacer eso, soy un bot serio. 🤖";
    client.sendMessage(message.from, msg);

    const wait = 5000;
    setTimeout(() => {
        msg = "¡Pero puedo contarte un chiste! 😄";
        client.sendMessage(message.from, msg);
    }, wait);

    setTimeout(() => {
        joke.getJoke('DAD', 'random', (jokeText) => {
            const emojiJoke = `😂😂 ¡Aquí tienes un chiste! ${jokeText} 😂😂`;
            client.sendMessage(message.from, emojiJoke);
            sendRandomSticker(client, message);
        });
    }, wait + 5000); // espera adicional para el chiste
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

module.exports = goreJoke; // Exporta la función para enviar un chiste y un sticker