const axios = require('axios');
const cheerio = require('cheerio');

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

async function checkNewsInfo() {
    // Intenta obtener noticias de la página
    let noticias = await fetchNews(getNewsUrl());

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

// Llamar a la función y manejar la promesa
checkNewsInfo()
    .then(news => console.log(news))
    .catch(error => console.error(error.message));
