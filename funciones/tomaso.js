const fs = require('fs');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');

const Jimp = require('jimp');
const webp = require('webp-converter');

const formatImageToWebpSticker = async (imageBuffer) => {
    // Ruta temporal para guardar la imagen y el sticker
    const tempImagePath = path.join(__dirname, '../temp/image.png');
    const tempStickerPath = path.join(__dirname, '../temp/sticker.webp');

    // Guardar la imagen buffer temporalmente
    fs.writeFileSync(tempImagePath, imageBuffer);

    // Cargar la imagen usando Jimp
    const image = await Jimp.read(tempImagePath);

    // Redimensionar la imagen (opcional, pero recomendado para stickers)
    image.resize(512, 512); // Cambia el tamaño según sea necesario

    // Guardar la imagen redimensionada
    await image.writeAsync(tempImagePath);

    // Convertir a WebP
    await new Promise((resolve, reject) => {
        webp.cwebp(tempImagePath, tempStickerPath, "-q 80", (status) => {
            if (status === 'error') {
                reject(new Error('Error al convertir la imagen a WebP'));
            } else {
                resolve();
            }
        });
    });

    // Leer el sticker convertido
    const stickerBuffer = fs.readFileSync(tempStickerPath);

    // Eliminar archivos temporales
    fs.unlinkSync(tempImagePath);
    fs.unlinkSync(tempStickerPath);

    return stickerBuffer;
};

// Ruta a la carpeta de media
const mediaDir = path.join(__dirname, '../media');

const tomaso = async (client, message) => {
    try {
        // Leer archivos de la carpeta media
        const files = fs.readdirSync(mediaDir);
        
        // Filtrar solo imágenes válidas (PNG)
        const mediaFiles = files.filter(file => file.endsWith('.png'));

        if (mediaFiles.length === 0) {
            await client.sendMessage(message.from, 'No se encontraron imágenes disponibles.');
            return;
        }

        // Seleccionar un archivo de media al azar
        const randomMedia = mediaFiles[Math.floor(Math.random() * mediaFiles.length)];
        const mediaPath = path.join(mediaDir, randomMedia);

        // Leer el archivo en un buffer
        const mediaBuffer = fs.readFileSync(mediaPath);

        // Convertir la imagen a sticker en formato webp usando el método estático
        const sticker = await formatImageToWebpSticker(mediaBuffer);

        // Enviar el sticker como un archivo multimedia
        await client.sendMessage(message.from, sticker, { sendMediaAsSticker: true });

        // Enviar un mensaje adicional (opcional)
        await client.sendMessage(message.from, 'Miau 🐱');
    } catch (error) {
        console.error('Error al enviar la imagen:', error);
        await client.sendMessage(message.from, 'Hubo un error al enviar la imagen.');
    }
}

module.exports = tomaso;
