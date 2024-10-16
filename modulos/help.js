const { usage, listParameters } = require('../utils/moduloUtils');

const sendHelp = async (client, message, args, commandMap) => {
    // Verificar si se solicita ayuda para un comando específico
    if (args && args.length === 1 && args[0].trim().length > 0) {
        const commandName = args[0].toLowerCase();

        if (commandMap[commandName]) {
            const command = commandMap[commandName];
            const helpMessage = `Ayuda: ${usage(command)} - ${command.info}\n${listParameters(command)}`;
            return await message.reply(helpMessage);
        } else {
            return await message.reply(`Comando desconocido: ${commandName}`);
        }
    }

    // Generar lista de comandos disponibles
    const availableCommands = Object.keys(commandMap)
        .map((comando, index) => `${index + 1}. ${usage(commandMap[comando])} - ${commandMap[comando].info}`)
        .join('\n\n');

    const helpMessage = `*Lista de comandos disponibles:*\n${availableCommands}\n\n\n` +
        `Símbolos: <> - requerido, [] - opcional`;

    await client.sendMessage(message.from, helpMessage);
};

module.exports = [
    {
        name: 'help',
        func: sendHelp,
        info: 'Muestra la lista de comandos disponibles',
        args: [{ name: 'comando', info: 'Ver ayuda específica de un comando' }]
    }
];
