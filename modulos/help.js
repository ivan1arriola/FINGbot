const { usage, listParameters } = require('../utils/moduloUtils');

const sendHelp = async (client, message, args, commandMap) => {
    try {
        const user = message.author || message.from; // Identificar al usuario que envió el mensaje
        const userID = user.split('@')[0]; // borrar lo que está después del @

        // Verificar si se solicita ayuda para un comando específico
        if (args && args.length === 1 && args[0].trim().length > 0) {
            const commandName = args[0].toLowerCase();

            if (commandMap[commandName]) {
                const command = commandMap[commandName];
                const helpMessage = `🔹 *@${userID}*, aquí está la ayuda para el comando *${commandName}*:\n\n` +
                    `🔸 *Uso:* ${usage(command)}\n` +
                    `🔸 *Descripción:* ${command.info}\n` +
                    `🔸 *Parámetros:* ${listParameters(command) || 'Ninguno'}`;

                return await message.reply(helpMessage);
            } else {
                return await message.reply(`❌ *@${userID}*, comando desconocido: *${commandName}*.`);
            }
        }

        // Generar lista de comandos disponibles
        const availableCommands = Object.keys(commandMap)
            .map((comando, index) => `*${index + 1}. ${usage(commandMap[comando])}* - ${commandMap[comando].info}`)
            .join('\n\n');

        const helpMessage = `💡 *@${userID}*, aquí está la lista de comandos disponibles:\n\n` +
            `*📜 Comandos:* \n${availableCommands}\n\n` +
            `❗️ *Símbolos:* \n<> - requerido, [] - opcional.`;

        await client.sendMessage(message.from, helpMessage, { mentions: [message.author] });
    } catch (error) {
        console.error("Error en sendHelp:", error.message);
        await client.sendMessage(message.from, "❌ Ocurrió un error al intentar mostrar la lista de comandos.");
    }
};

module.exports = [
    {
        name: 'help',
        func: sendHelp,
        info: 'Muestra la lista de comandos disponibles',
        args: [{ name: 'comando', info: 'Ver ayuda específica de un comando' }]
    }
];
