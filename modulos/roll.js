const WAWebJS = require('whatsapp-web.js');

/**
 * Función para realizar la tirada de dados en base a la expresión.
 * @param {string} expression - La expresión de la tirada (por ejemplo, "3d6").
 * @returns {string} - El resultado de la tirada, los valores individuales y el total.
 */
function calcularTirada(expression) {
    const regex = /(\d*)d(\d+)/; // Expresión regular para capturar la tirada (ej. 3d6)
    const match = expression.match(regex);
    
    if (!match) {
        return "⚠️ Expresión no válida. Usa el formato XdY (ej. 3d6).";
    }

    let [ , cantidadDados, carasDados] = match;
    
    cantidadDados = parseInt(cantidadDados) || 1; // Si no hay un número de dados, se asume 1
    carasDados = parseInt(carasDados);

    // Verificar si la cantidad de caras en el dado es válida
    if (carasDados <= 0) {
        return "⚠️ El número de caras del dado debe ser mayor que 0.";
    }

    // Realizar la tirada
    let resultadoTirada = 0;
    const tiradasIndividuales = [];

    for (let i = 0; i < cantidadDados; i++) {
        const resultado = Math.floor(Math.random() * carasDados) + 1;
        tiradasIndividuales.push(resultado);
        resultadoTirada += resultado;
    }

    // Formatear el resultado de una manera más estilizada
    const tiradasStr = tiradasIndividuales.map(tirada => `🎲 ${tirada}`).join(' - ');

    return `🎲 *Tirada de ${cantidadDados} dados de ${carasDados} caras* 🎲\n` + 
           `${tiradasStr}\n` + 
           `🔢 *Total*: ${resultadoTirada}`;
}


/**
 * @param {WAWebJS.Client} client
 * @param {WAWebJS.Message} message
 * @param {object} args
 */
async function roll(client, message, args) {
    const match = /!roll (.+)/.exec(message.body);

    // Verificamos si hay coincidencias antes de acceder al índice 1
    if (!match || match.length < 2) {
        await message.reply("No se pudo ejecutar la tirada. Asegúrate de ingresar el comando correctamente.");
        return;
    }

    const expression = match[1];  // Obtiene la expresión de la tirada
    const resultado = calcularTirada(expression); // Realiza el cálculo de la tirada

    // Enviar el resultado como respuesta
    await message.reply(`El resultado de la tirada es: ${resultado}`);
}

// Exporta la función con la estructura adecuada
module.exports = [
    {
        name: 'roll',
        func: roll,
        info: 'Tirada de dados.',
        args: [{ name: 'expresión', info: 'Expresión de la tirada', required: true }],
        min_args: 1
    }
];
