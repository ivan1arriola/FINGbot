

const ping = async (client, message) => {
    const userId = message.from;
    const currentTime = new Date();
    const formattedTime = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
    console.log(`${userId} - ${formattedTime} - Respondiendo a ping...`);
    await message.reply('pong 🏓');
}

module.exports = ping; // Exporta la función para responder al comando "!ping"