const axios = require('axios');
const cheerio = require('cheerio');

// Función para obtener el URL de la sección de noticias para un mes y año dados
function getNewsUrl(year, month) {
    return `https://www.fing.edu.uy/es/comunicacion/noticias/archivo/${year}${month}`;
}

// Función para obtener noticias
async function fetchNews(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const noticias = [];

        // Recorre los elementos de la lista de noticias
        $('#views-bootstrap-vista-noticias-page-2 .list-group-item').each((index, element) => {
            const title = $(element).find('h4 a').text();
            const summary = $(element).find('.views-field-body .field-content p').text();
            const link = 'https://www.fing.edu.uy' + $(element).find('h4 a').attr('href');
            const date = $(element).find('time').text(); // Obtén la fecha de publicación

            noticias.push({ title, summary, link, date });
        });

        return noticias; // Retorna las noticias obtenidas
    } catch (error) {
        throw new Error("No pudimos obtener la información de las noticias en este momento.");
    }
}

async function checkNewsInfo() {
    const date = new Date(); // Obtén la fecha actual
    const year = date.getFullYear(); // Obtén el año actual
    const currentMonth = (date.getMonth() + 1).toString().padStart(2, '0'); // Obtén el mes actual (formato 01-12)
    const previousMonth = (date.getMonth()).toString().padStart(2, '0'); // Mes anterior (formato 01-12)

    // Intenta obtener noticias del mes actual
    let noticias = await fetchNews(getNewsUrl(year, currentMonth));

    // Si no hay suficientes noticias, intenta obtener del mes anterior
    if (noticias.length < 4) {
        noticias = [...noticias, ...await fetchNews(getNewsUrl(year, previousMonth))];
    }

    // Filtra y toma solo las últimas 4 noticias
    const latestNews = noticias.slice(0, 4);

    if (latestNews.length > 0) {
        return latestNews.map(n => 
            `*${n.title}*\n` + // Título en negrita
            `_${n.date}_\n` + // Fecha en cursiva
            `${n.summary}\n` + // Resumen
            `Leer más: ${n.link}\n` // Enlace
        ).join('\n\n'); // Unir las noticias con doble línea
    } else {
        return 'No se encontraron noticias.';
    }
}

module.exports = checkNewsInfo;
