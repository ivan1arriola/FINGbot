const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.fing.edu.uy/es/bedelia/exámenes';

async function checkExamInfo() {
    try {
        // Realiza la solicitud GET
        const response = await axios.get(url);

        // Cargar el contenido HTML en Cheerio
        const $ = cheerio.load(response.data);

        // Busca la expresión "Diciembre 2024"
        const bodyText = $('body').text(); // Obtén el texto del cuerpo de la página
        const found = bodyText.includes('Diciembre 2024');

        // Devuelve el mensaje según el resultado
        if (found) {
            return `La información sobre los exámenes 2024 ya se encuentra disponible en ${url}`;
        } else {
            return 'Aún no hay información de los exámenes de diciembre.';
        }
    } catch (error) {
        return "No pudimos obtener la información de los exámenes en este momento.";
    }
}

module.exports = checkExamInfo;