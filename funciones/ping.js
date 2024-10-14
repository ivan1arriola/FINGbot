const ping = async (client, message) => {
    try {
        const userId = message.from;
        const currentTime = new Date();
        const formattedTime = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
        
        console.log(`${userId} - ${formattedTime} - Respondiendo a ping...`);
        
        // Intentar responder al mensaje
        await message.reply('pong 🏓');
    } catch (error) {
        console.error("Error al responder a ping: ", error.message);
        // Si falla, intenta enviar una respuesta genérica
        try {
            await message.reply('Ocurrió un error al intentar responder al ping.');
        } catch (innerError) {
            console.error("Error al enviar el mensaje de error: ", innerError.message);
        }
    }
};

module.exports = ping;
