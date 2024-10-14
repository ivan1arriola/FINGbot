const axios = require('axios');
const cheerio = require('cheerio');
const { Client } = require('whatsapp-web.js');

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

            noticias.push({ title, summary, link, date });
        });

        return noticias; // Retorna las noticias obtenidas
    } catch (error) {
        throw new Error("No pudimos obtener la información de las noticias en este momento.");
    }
}

// Función para comprobar la información de las noticias y enviar los resultados
async function checkNewsInfo(client, msg) {
    try {
        // Intenta obtener noticias de la página
        const noticias = await fetchNews(getNewsUrl());

        // Filtra y toma solo las últimas 4 noticias
        const latestNews = noticias.slice(0, 4);

        // Formatea las noticias para enviarlas como 4 mensajes separados
        if (latestNews.length > 0) {
            for (const news of latestNews) {
                const mensaje = `📰 ${news.title}\n${news.summary}\n📅 ${news.date}\n🔗 ${news.link}`;
                await client.sendMessage(msg.from, mensaje); // Envía cada noticia por WhatsApp
            }
        } else {
            await client.sendMessage(msg.from, "No hay noticias disponibles en este momento.");
        }
    } catch (error) {
        await client.sendMessage(msg.from, "No pudimos obtener la información de las noticias en este momento.");
    }
}

module.exports = checkNewsInfo; // Exporta la función para obtener noticias
