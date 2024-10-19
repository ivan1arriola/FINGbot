// ping.js

async function ping(client, message, args) {
    try {
        // Obtener el ID del usuario que envió el mensaje
        const userId = message.from;
        
        // Obtener la hora actual y formatearla
        const currentTime = new Date();
        const formattedTime = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;

        // Responder al mensaje con un mensaje formateado
        const replyMessage = `🏓 ¡Pong! Respuesta recibida a las ${formattedTime}.`;
        await message.reply(replyMessage);
    } catch (error) {
        console.error("Error al responder a ping: ", error.message);
        
        // Si falla, intenta enviar una respuesta genérica
        try {
            const errorMessage = "❌ Ocurrió un error al intentar responder al ping. Por favor, inténtalo de nuevo más tarde.";
            await message.reply(errorMessage);
        } catch (innerError) {
            console.error("Error al enviar el mensaje de error: ", innerError.message);
        }
    }
}

// Exportar el comando con el formato adecuado
module.exports = [
    { name: 'ping', func: ping, info: 'Responde con pong 🏓', args: [] }
];
