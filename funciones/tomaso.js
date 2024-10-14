const fs = require('fs');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');

// Ruta a la carpeta de media
const mediaDir = path.join(__dirname, '../media');

const tomaso = async (client, message) => {
    try {
        // Leer archivos de la carpeta media
        const files = fs.readdirSync(mediaDir);
        
        // Filtrar solo imágenes válidas (PNG)
        const mediaFiles = files.filter(file => file.endsWith('.png'));

        // Seleccionar un archivo de media al azar
        const randomMedia = mediaFiles[Math.floor(Math.random() * mediaFiles.length)];
        const mediaPath = path.join(mediaDir, randomMedia);

        // Crear un objeto MessageMedia a partir del archivo
        const media = MessageMedia.fromFilePath(mediaPath);

        // Enviar la imagen con un caption
        await client.sendMessage(message.from, media, { caption: 'Este es Tomaso 😊' });

        // Manda un maullido
        await client.sendMessage(message.from, 'Miau 🐱');
    } catch (error) {
        console.error('Error al enviar la imagen:', error);
    }
}

module.exports = tomaso; // Exporta la función para usarla en otras partes del código
