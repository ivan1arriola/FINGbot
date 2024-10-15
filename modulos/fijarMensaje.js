// hasQuotedMsg  boolean
//Indicates if the message was sent as a reply to another message.

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
        info: 'Fija el mensaje al que respondiste.',
        args: [],
    }
];