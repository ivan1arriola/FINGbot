const config = require('../config');
const { usage } = require('./moduloUtils');

// Función para verificar si un comando es válido
const esComandoValido = (command, commandMap) => {
    return command in commandMap && typeof commandMap[command].func === 'function';
};


// Funciones auxiliares
function parseCommand(input) {
    const regex = /(?:[^\s"]+|"[^"]*")+/g; // Detecta argumentos con espacios, los argumentos entre "" swran tratados como uno solo
    const parts = input.match(regex).map(part => part.replace(/"/g, ''));
    const comando = parts.shift().toLowerCase();
    const args = parts;
    return [
        comando,
        args
    ];
}

// Función para procesar el comando
const procesarComando = async (client, message, commandMap) => {
    const [command,args] = parseCommand(message.body.trim().slice(config.PREFIJO.length));
    
    // Verificar si el comando es válido usando la nueva función
    if (esComandoValido(command, commandMap)) {
        // Imprimir por consola el comando válido con colores usando secuencias de escape ANSI
        console.log(`\x1b[32m✔ Se detectó comando válido: \x1b[34m[${command}]\x1b[0m`);

        const commandObj = commandMap[command];
        
        // Verificar el mínimo de argumentos
        if (args.length < commandObj.min_args) {
            return await message.reply(usage(commandObj));
        }

        // Si el comando es 'help', pasar `commandMap` como argumento adicional
        if (command === 'help') {
            await commandObj.func(client, message, args, commandMap);
        } else {
            await commandObj.func(client, message, args);
        }
    } else {
        await client.sendMessage(message.from, `El comando "${command}" no es válido.`);
    }
};

module.exports = { procesarComando };
