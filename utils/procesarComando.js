const config = require('../config');
const { usage } = require('./moduloUtils');

// Función para verificar si un comando es válido
const esComandoValido = (command, commandMap) => {
    return commandMap.hasOwnProperty(command) && typeof commandMap[command].func === 'function';
};

// Funciones auxiliares
function parseCommand(input) {
    const regex = /(?:[^\s"]+|"[^"]*")+/g;
    return input.match(regex).map(part => part.replace(/"/g, ''));
}

// Función para procesar el comando
const procesarComando = async (client, message, commandMap) => {
    const commandText = message.body.trim().slice(config.PREFIJO.length);
    const parts = parseCommand(commandText);
    
    if (!parts.length) return;

    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Verificar si el comando es válido antes de hacer cualquier otra cosa
    if (!esComandoValido(command, commandMap)) {
        return await client.sendMessage(message.from, `El comando "${command}" no es válido.`);
    }

    const commandObj = commandMap[command];
 
    // Verificar el mínimo de argumentos antes de llamar cualquier función
    if (args.length < commandObj.min_args) {
        return await message.reply(usage(commandObj));
    }

    // Procesar el comando (evitar logs innecesarios en producción)
    if (command === 'help') {
        await commandObj.func(client, message, args, commandMap);
    } else {
        await commandObj.func(client, message, args);
    }
};

// Función para obtener el comando del mensaje
function obtenerComando(body) {
    return body.trim().toLowerCase().slice(config.PREFIJO.length).split(" ")[0];
}

module.exports = { procesarComando, obtenerComando };
