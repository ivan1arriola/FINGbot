const axios = require("axios");
const { MessageMedia } = require("whatsapp-web.js");
const WAWebJS = require("whatsapp-web.js");

/**
 *  @param {WAWebJS.Client} client 
 *  @param {WAWebJS.Message} message
*/
const sendCalendarioLectivoImagen = async (client, message, args) => {
    try {
        let mes = new Date().getMonth() + 1; // indizado en 1
        let meses = [];
        while (mes <= 12) {
            meses.push(mes++);
        }

        /** @type {Uint8Array} */
        const img = (await axios({
            method: "post",
            url: "http://fing-bot.brazilsouth.cloudapp.azure.com/calendario",
            data: { meses },
            responseType: "arraybuffer"
        })).data;

        const media = new MessageMedia("image/png", base64ArrayBuffer(img), "calendario.png", img.length);
        await message.reply(media);

    } catch (error) {
        console.error("Error al obtener la imagen del calendario:", error);
        await message.reply("Hubo un error al generar la imagen del calendario. Por favor, intenta más tarde.");
    }
};

// Exportar el comando en el formato adecuado
module.exports = [
    { name: "calendariolectivoimagen", func: sendCalendarioLectivoImagen, info: "Devuelve una imagen del calendario lectivo restante.", args: [] }
];

function base64ArrayBuffer(arrayBuffer) {
    try {
        var base64 = '';
        var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  
        var bytes = new Uint8Array(arrayBuffer);
        var byteLength = bytes.byteLength;
        var byteRemainder = byteLength % 3;
        var mainLength = byteLength - byteRemainder;
  
        var a, b, c, d;
        var chunk;
  
        // Main loop deals with bytes in chunks of 3
        for (var i = 0; i < mainLength; i = i + 3) {
            chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
            a = (chunk & 16515072) >> 18;
            b = (chunk & 258048) >> 12;
            c = (chunk & 4032) >> 6;
            d = chunk & 63;
  
            base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
        }

        // Deal with the remaining bytes and padding
        if (byteRemainder == 1) {
            chunk = bytes[mainLength];
            a = (chunk & 252) >> 2;
            b = (chunk & 3) << 4;
            base64 += encodings[a] + encodings[b] + '==';
        } else if (byteRemainder == 2) {
            chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
            a = (chunk & 64512) >> 10;
            b = (chunk & 1008) >> 4;
            c = (chunk & 15) << 2;
            base64 += encodings[a] + encodings[b] + encodings[c] + '=';
        }
    
        return base64;
    } catch (error) {
        console.error("Error al convertir el buffer a base64:", error);
        return null;
    }
}
