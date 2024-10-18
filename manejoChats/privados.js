// manejoChatsPrivados.js
const TIEMPO_CHAT_INACTIVO = 5 * 60 * 1000; // 5 minutos
const MENSAJE_BIENVENIDA = '¡Hola! Soy un bot creado por estudiantes de la FING para ayudarte con información sobre cursos y otras cosas. Si necesitas ayuda, escribe !help.';

// Función para iniciar chat
async function iniciarChat(chat) {
    await chat.sendMessage(MENSAJE_BIENVENIDA);
}

// Función para manejar mensajes privados
async function manejarMensajesPrivados(client, message, commandMap) {
    const chat = await message.getChat();
    const command = obtenerComando(message.body);

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
