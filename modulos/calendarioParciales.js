const axios = require('axios');
const cheerio = require('cheerio');
const { MessageMedia } = require('whatsapp-web.js');

// Función para obtener el calendario de parciales
async function getParcialesCalendar() {
    const url = 'https://www.fing.edu.uy/es/bedelia/parciales'; // URL de la página de exámenes
    try {
        const response = await axios.get(url); // Realiza la solicitud GET
        const $ = cheerio.load(response.data); // Carga el contenido HTML

        // Array para almacenar los calendarios de parciales
        const calendarios = [];

        // Busca el calendario de parciales de 1ros y 2dos parciales
        $('table').each((index, table) => {
            const header = $(table).find('h2').text(); // Obtiene el encabezado de la tabla
            if (header.includes('Parciales')) {
                $(table).find('a').each((i, element) => {
                    const link = $(element).attr('href');
                    if (link && link.endsWith('.pdf') && link.match(/calendario/i)) {
                        calendarios.push(link); // Agrega el enlace a la lista
                    }
                });
            }
        });

        return calendarios; // Retorna los enlaces encontrados
    } catch (error) {
        throw new Error("No pudimos obtener el calendario de parciales en este momento.");
    }
}

// Función para devolver los calendarios de parciales
async function devolverCalendarioParciales(client, message) {
    try {
        await message.reply('Estoy buscando información sobre los calendarios de parciales...');

        const calendarios = await getParcialesCalendar(); // Obtiene los calendarios

        // Verifica si se encontraron calendarios
        if (calendarios.length > 0) {
            for (const link of calendarios) {
                const media = await MessageMedia.fromUrl(link); // Crea un objeto MessageMedia desde el enlace
                await client.sendMessage(message.from, media); // Envía cada calendario como un mensaje de media
            }
        } else {
            await client.sendMessage(message.from, "No se encontraron calendarios de parciales disponibles en este momento.");
        }
    } catch (error) {
        await client.sendMessage(message.from, error.message); // Envía el mensaje de error
    }
}

module.exports = [{name:'parciales',
                   info:'Obtiene el calendario de los parciales disponibles'
                  }]; // Exporta la función para devolver los calendarios de parciales
