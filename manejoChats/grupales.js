const { procesarComando } = require('../utils/procesarComando');

// Manejo de mensajes grupales
const manejarMensajesGrupales = async (client, message) => {
    await procesarComando(client, message, commandMap);
};

module.exports = {
    manejarMensajesGrupales,
};