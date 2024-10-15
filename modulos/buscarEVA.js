const axios = require('axios');
const cheerio = require('cheerio');

// Función para buscar el curso en Google y obtener el primer enlace de EVA
async function buscarEva(client, message, args) {
    try {
        // Unir los argumentos en un solo string
        const curso = message.body.replace('!buscareva ', '').trim();
        if (!curso) {
            await message.reply("Por favor, proporciona el nombre del curso.");
            return;
        }

        // Realizar la búsqueda en Google
        const googleSearchUrl = `https://www.google.com/search?q=FING+EVA+${encodeURIComponent(curso)}`;
        
        // Configurar las cabeceras para evitar el bloqueo de Google
        const response = await axios.get(googleSearchUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
            }
        });

        const $ = cheerio.load(response.data);

        // Buscar el primer enlace que coincida con el dominio eva.fing.edu.uy
        let foundLink = null;
        $('a').each((index, element) => {
            const link = $(element).attr('href');
            if (link && link.includes('https://eva.fing.edu.uy/course/view.php?id=')) {
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
