const axios = require('axios');
const cheerio = require('cheerio');


// Función para comprobar la información de los exámenes
async function checkExamInfo(client, msg) {
    try {

        message.reply('Estoy buscando información sobre los exámenes...');

        // Realiza la solicitud GET
        const response = await axios.get("https://www.fing.edu.uy/es/bedelia/ex%C3%A1menes");

        // Cargar el contenido HTML en Cheerio
        const $ = cheerio.load(response.data);

        // Busca la expresión "Diciembre 2024"
        const bodyText = $('body').text(); // Obtén el texto del cuerpo de la página
        const found = bodyText.includes('Diciembre 2024');

        // Mensajes de respuesta
        let mensajesRespuesta = [];

        // Devuelve el mensaje según si encuentra la expresión
        if (found) {
            mensajesRespuesta.push("¡El calendario de exámenes de Diciembre 2024 ya está disponible! 📅📚");

            // Extraer enlaces a PDF que contengan "diciembre" en la URL
            $('a').each((index, element) => {
                const href = $(element).attr('href');
                if (href && href.includes('diciembre') && href.endsWith('.pdf')) {
                    mensajesRespuesta.push(`Puedes descargar el calendario de exámenes aquí: ${href}`);
                }
            });

            // Envía los mensajes a través de WhatsApp
            for (const mensaje of mensajesRespuesta) {
                await client.sendMessage(msg.from, mensaje);
            }
        } else {
            await client.sendMessage(msg.from, "No se encontró información sobre el calendario de exámenes de Diciembre 2024.");
        }
    } catch (error) {
        console.error("Error al obtener la información de los exámenes:", error);
        await client.sendMessage(msg.from, "No pudimos obtener la información de los exámenes en este momento.");
    }
}

module.exports = checkExamInfo; // Exporta la función para comprobar la información de los exámenes