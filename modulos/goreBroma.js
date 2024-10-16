const fs = require('fs');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');
const sendRandomSticker = require('../utils/sendRandomSticker');

// Ruta a la carpeta de stickers
const stickersDir = path.join(__dirname, '../stickers');

// Cargar chistes desde el archivo JSON
const jokesPath = path.join(__dirname, '../datos/chistes.json');
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
            const emojiJoke = `😂😂${randomJoke} 😂😂
            `;
            await client.sendMessage(message.from, emojiJoke);
            await sendRandomSticker(stickersDir, client, message);
        }, wait + 5000); // espera adicional para el chiste
    } catch (error) {
        console.error("Error al enviar chiste y sticker:", error);
        await client.sendMessage(message.from, "Ocurrió un error al intentar enviar el chiste.");
    }
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
