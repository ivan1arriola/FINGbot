const axios = require('axios');
const cheerio = require('cheerio');
const { MessageMedia } = require('whatsapp-web.js');

// Función para obtener el URL de la sección de noticias
function getNewsUrl() {
    return `https://www.fing.edu.uy/es/noticias`;
}

// Función para obtener noticias
async function fetchNews(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const noticias = [];

        // Recorre los elementos de la lista de noticias
        $('.views-element-container .view-content .odd, .views-element-container .view-content .even').each((index, element) => {
            const title = $(element).find('a').first().text().trim();
            const summary = $(element).find('p').first().text().trim();
            const link = 'https://www.fing.edu.uy' + $(element).find('a').attr('href');
            const date = $(element).find('time').text().trim(); // Obtén la fecha de publicación

            // Solo agrega noticias que tienen título y resumen
            if (title && summary) {
                noticias.push({ title, summary, link, date });
            }
        });

        return noticias; // Retorna las noticias obtenidas
    } catch (error) {
        console.error("Error al obtener noticias:", error);
        throw new Error("No pudimos obtener la información de las noticias en este momento.");
    }
}

// Función para comprobar la información de las noticias y enviar los resultados
async function checkNewsInfo(client, msg, args) {
    try {
        const cantidad = args[0] ? Math.min(parseInt(args[0]), 4) : 1; // Cantidad de noticias (máx 4, por defecto 1)
        console.log(`Obteniendo las últimas ${cantidad} noticias...`);

        // Intenta obtener noticias de la página
        const noticias = await fetchNews(getNewsUrl());

        // Filtra y toma las últimas n noticias
        const latestNews = noticias.slice(0, cantidad);

        // Formatea las noticias para enviarlas como mensajes
        if (latestNews.length > 0) {
            for (const news of latestNews) {
                const mensaje = `📰 ${news.title}\n${news.summary}\n📅 ${news.date}\n🔗 ${news.link}`;
                await client.sendMessage(msg.from, mensaje); // Envía cada noticia por WhatsApp
            }
        } else {
            await client.sendMessage(msg.from, "No hay noticias disponibles en este momento.");
        }
    } catch (error) {
        console.error("Error al enviar noticias:", error);
        await client.sendMessage(msg.from, "No pudimos obtener la información de las noticias en este momento.");
    }
}

// Exportar el comando en el formato adecuado
module.exports = [
    { name: 'noticias', func: checkNewsInfo, info: 'Obtiene las últimas noticias de la Facultad de Ingeniería', args: ['<n>'] }
];
