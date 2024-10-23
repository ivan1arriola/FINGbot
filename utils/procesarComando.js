const config = require('../config');
const { usage } = require('./moduloUtils');
const ADMINISTRADOR = config.ADMINISTRADOR

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
    try {
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
        if(commandObj.admin && message.from !=ADMINISTRADOR) return await client.sendMessage(message.from,`No eres administrador`); 
        // Verificar el mínimo de argumentos antes de llamar cualquier función
        if (args.length < commandObj.min_args) {
            return await message.reply(usage(commandObj));
        }

        // Procesar el comando (evitar logs innecesarios en producción)
        if (commandObj.hasOwnProperty("system")) {
            await commandObj.func(client, message, args, commandMap);
        } else {
            await commandObj.func(client, message, args);
        }
    } catch (error) {
        console.error('Ocurrió un error al procesar el comando: ', error.message);
        await client.sendMessage(message.from, '⚠️ Ocurrió un error al procesar tu comando.'); // Mensaje genérico para el usuario
    }
};

// Función para obtener el comando del mensaje
function obtenerComando(body) {
    return body.trim().toLowerCase().slice(config.PREFIJO.length).split(" ")[0];
}

module.exports = { procesarComando, obtenerComando };
