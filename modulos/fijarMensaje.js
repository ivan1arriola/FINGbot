const fijarMensaje = async (client, message, args) => {
    try {
        if (!message.hasQuotedMsg) {
            await message.reply("Debes responder a un mensaje para fijarlo.");
            return;
        }

        const quotedMessage = await message.getQuotedMessage();
        if (!quotedMessage) {
            await message.reply("No pude obtener el mensaje al que respondiste.");
            return;
        }

        // Verificar si es un grupo
        const chat = await message.getChat();
        if (!chat.isGroup) {
            await message.reply("Este comando solo se puede usar en grupos.");
            return;
        }

        // Verificar si el bot es administrador
        const botParticipant = chat.participants.find(p => p.id._serialized === client.info.wid._serialized);

        if (!botParticipant || !botParticipant.isAdmin) {
            await message.reply("No puedo fijar el mensaje porque no soy administrador del grupo.");
            return;
        }

        // Fijar el mensaje
        await quotedMessage.pin();
        await message.reply("Mensaje fijado correctamente.");
    } catch (error) {
        console.error("Error en fijarMensaje:", error.message);
        await message.reply("Ocurrió un error al procesar tu solicitud. Intenta nuevamente.");
    }
}

module.exports = [
    {
        name: 'fijarmensaje',
        func: fijarMensaje,
        info: 'Fija el mensaje al que respondiste si el bot es administrador del grupo.',
        args: [],
    }
];
