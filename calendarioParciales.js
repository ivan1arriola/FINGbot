const axios = require('axios');
const cheerio = require('cheerio');
const { MessageMedia } = require('whatsapp-web.js');

// Función para obtener el calendario de parciales
async function getParcialesCalendar() {
    const url = 'https://www.fing.edu.uy/es/bedelia/parciales'; // URL de la página de exámenes
    try {
        console.log("Realizando solicitud GET a:", url); // Mensaje en consola
        const response = await axios.get(url); // Realiza la solicitud GET
        console.log("Solicitud realizada con éxito."); // Mensaje en consola
        const $ = cheerio.load(response.data); // Carga el contenido HTML

        // Array para almacenar los calendarios de parciales
        const calendarios = [];

        // Busca el calendario de parciales de 1ros y 2dos parciales
        $('table').each((index, table) => {
            const header = $(table).find('h2').text(); // Obtiene el encabezado de la tabla
            if (header.includes('Parciales')) {
                console.log(`Encontrada tabla de parciales: ${header}`); // Mensaje en consola
                $(table).find('a').each((i, element) => {
                    const link = $(element).attr('href');
                    if (link && link.endsWith('.pdf') && link.match(/calendario/i)) {
                        calendarios.push(link); // Agrega el enlace a la lista
                        console.log(`Calendario encontrado: ${link}`); // Mensaje en consola
                    }
                });
            }
        });

        console.log("Calendarios de parciales obtenidos:", calendarios); // Mensaje en consola
        return calendarios; // Retorna los enlaces encontrados
    } catch (error) {
        console.error("Error al obtener el calendario de parciales:", error);
        throw new Error("No pudimos obtener el calendario de parciales en este momento.");
    }
}

// Función para devolver los calendarios de parciales
async function devolverCalendarioParciales(client, message) {
    try {
        await message.reply('Estoy buscando información sobre los calendarios de parciales...');
        console.log('Mensaje de respuesta enviado al usuario.'); // Mensaje en consola

        const calendarios = await getParcialesCalendar(); // Obtiene los calendarios

        console.log('Calendarios de parciales encontrados:', calendarios);

        // Verifica si se encontraron calendarios
        if (calendarios.length > 0) {
            for (const link of calendarios) {
                const media = await MessageMedia.fromUrl(link); // Crea un objeto MessageMedia desde el enlace
                await client.sendMessage(message.from, media); // Envía cada calendario como un mensaje de media
                console.log(`Calendario enviado a ${message.from}: ${link}`); // Mensaje en consola
            }
        } else {
            await client.sendMessage(message.from, "No se encontraron calendarios de parciales disponibles en este momento.");
            console.log("No se encontraron calendarios de parciales."); // Mensaje en consola
        }
    } catch (error) {
        await client.sendMessage(message.from, error.message); // Envía el mensaje de error
        console.error("Error al devolver el calendario de parciales:", error); // Mensaje de error en consola
    }
}

module.exports = devolverCalendarioParciales; // Exporta la función para devolver los calendarios de parciales
