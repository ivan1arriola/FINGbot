// manejoChatsPrivados.js
const config = require('../config');
const { difundirMensaje } = require('../manejoChats/difusion');

const TIEMPO_CHAT_INACTIVO = config.TIEMPO_CHAT_INACTIVO;
const MENSAJE_BIENVENIDA = config.MENSAJE_BIENVENIDA;
const ADMINISTRADOR = config.ADMINISTRADOR

// Función para iniciar chat
async function iniciarChat(chat) {
    await chat.sendMessage(MENSAJE_BIENVENIDA);
}

// Función para manejar mensajes privados
async function manejarMensajesPrivados(client, message, commandMap) {
    const chat = await message.getChat();
    const command = obtenerComando(message.body);

    if (message.fromMe) {
        return;
    }

    if (message.body.startsWith(config.PREFIJO_ADMIN)) {
        if (message.from === ADMINISTRADOR) {
            if (message.body === config.PREFIJO_ADMIN + 'difundir') {
                await difundirMensaje(client, message);
            }
        }
        return;
    }

    if (esComandoValido(command, commandMap)) {
        await procesarComando(client, message, commandMap);
    } else {
        await manejarChatNuevo(chat);
    }
}



// Verificar si el comando es válido
function esComandoValido(command, commandMap) {
    return command in commandMap && typeof commandMap[command].func === 'function';
}

// Manejo de chat nuevo si es necesario
async function manejarChatNuevo(chat) {
    const mensajesAnteriores = await chat.fetchMessages({ limit: 5 });
    
    if (mensajesAnteriores.length === 0 || esMomentoDeIniciarChat(mensajesAnteriores)) {
        await iniciarChat(chat);
    }
}

// Función para determinar si es momento de iniciar el chat
function esMomentoDeIniciarChat(mensajesAnteriores) {
    const ultimoMensaje = mensajesAnteriores[mensajesAnteriores.length - 1];
    return ultimoMensaje.fromMe || (new Date() - new Date(ultimoMensaje.timestamp) > TIEMPO_CHAT_INACTIVO);
}

module.exports = {
    manejarMensajesPrivados,
};
