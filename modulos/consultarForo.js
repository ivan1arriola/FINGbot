const getReplies = require('../utils/foros.js');

async function consultarForo(client, message) {
    try {
        let args = message.body.split(' ').slice(1); // saltamos el comando
        if (args.length < 1) return await message.reply('Uso: !foro <id>');

        let foroid = args[0];
        let respuestas = await getReplies(foroid, 3);

        // Manejo de errores si no se obtienen respuestas válidas
        if (respuestas.length === 0) {
            return await message.reply('ID del foro inválido. Verifique que este foro sea público o válido.');
        }

        // Construir el mensaje de respuestas
        let text = 'Últimas 3 respuestas:\n';
        respuestas.forEach(respuesta => {
            text += `${respuesta.titulo} ( ${respuesta.url} )\n`;
        });

        return await message.reply(text);
    } catch (error) {
        console.error("Error al obtener respuestas del foro:", error);
        await message.reply('Ocurrió un error al intentar obtener las respuestas.');
    }
}

// Exporta la función con la estructura adecuada
module.exports = [
    {
        name: 'consultarforo',
        func: consultarForo,
        info: 'Obtiene las últimas 3 respuestas de un foro dado por ID',
        args: ['<id>'],
    }
];
