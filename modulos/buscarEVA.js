const axios = require('axios');
const cheerio = require('cheerio');

// Función para buscar el curso en Google y obtener el primer enlace de EVA
async function buscarEva(client, message, args) {
    try {
        //const curso = args.join(' '); // Unir los argumentos en un solo string
        const curso = message.body.replace('!buscareva ', ''); // Unir los argumentos en un solo string
        if (!curso) {
            await message.reply("Por favor, proporciona el nombre del curso.");
            return;
        }

        // Realizar la búsqueda en Google
        const googleSearchUrl = `https://www.google.com/search?q=FING+EVA+${encodeURIComponent(curso)}`;
        console.log(`Buscando en Google: ${googleSearchUrl}`);
        const response = await axios.get(googleSearchUrl);
        const $ = cheerio.load(response.data);

        // Buscar el primer enlace que coincida con el dominio eva.fing.edu.uy
        let foundLink = null;
        $('a').each((index, element) => {
            const link = $(element).attr('href');
            console.log(`Enlace encontrado: ${link}`);
            if (link && link.includes('eva.fing.edu.uy')) {
                foundLink = link;
                return false; // Salir del loop
            }
        });

        if (foundLink) {
            await message.reply(foundLink);
        } else {
            await message.reply("No se encontraron enlaces relevantes para ese curso.");
        }
    } catch (error) {
        console.error("Error en buscarEva:", error.message);
        await message.reply("Ocurrió un error al procesar tu solicitud. Intenta nuevamente.");
    }
}

// Exportar el comando en el formato adecuado
module.exports = [
    {
        name: 'buscareva',
        func: buscarEva,
        info: 'Busca en Google el EVA del curso especificado y devuelve el primer enlace.',
        args: ['<curso>'],
    }
];
