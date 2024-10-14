const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const checkExamInfo = require('./funciones/examen'); // Asegúrate de que este módulo exista
const checkNewsInfo = require('./funciones/noticias'); // Asegúrate de que este módulo exista
const devolverCalendarioParciales = require('./funciones/calendarioParciales'); // Asegúrate de que este módulo exista
const getBedeliaInfo = require('./funciones/bedelia'); // Asegúrate de que este módulo exista
const tomaso = require('./funciones/tomaso'); // Asegúrate de que este módulo exista
const ping = require('./funciones/ping'); // Asegúrate de que este módulo exista
const fechas = require('./funciones/fechas'); // Asegúrate de que este módulo exista
const cuandoParcial = require('./funciones/cuandoParcial'); // Asegúrate de que este módulo exista
const goreJoke = require('./funciones/gore'); // Asegúrate de que este módulo exista
const foroReply = require('./funciones/foroRespuestas.js')
const fs = require('fs')
const path = require('path')
// Definir sendHelp antes de su uso
const sendHelp = async (client, message) => {
    const helpMessage = `*Lista de comandos disponibles:*\n
    ${Object.keys(commandMap).map((comando, indice) => `${indice + 1}. ${comando}`).join('\n')}`;

    // Enviar el mensaje de ayuda
    await client.sendMessage(message.from, helpMessage);
};

// Mapeo de comandos a funciones
const commandMap = {
    '!examenes': checkExamInfo,
    '!noticias': checkNewsInfo,
    '!ping': ping,
    '!parciales': devolverCalendarioParciales,
    '!Tomaso': tomaso,
    '!tomaso': tomaso,
    '!bedelia': getBedeliaInfo,
    '!bedelias': getBedeliaInfo,
    '!fechas': fechas,
    '!help': sendHelp,
    '!gore': goreJoke,
    '!cuando': cuandoParcial,
    '!foro' : foroReply
};
// Para uso futuro
function loadModules(modulos_dir){
    modulos = {}
    try{
    files=fs.readdirSync(path.join(__dirname,modulos_dir))
    
        for(const file of files){
            try{
                modulo = require(path.join(__dirname,modulos_dir,file))
                for(const cmd of modulo){
                    modulos[cmd.name]=cmd
                }
            }catch(error){
                console.log(`No se pudo cargar el modulo ${file}: ${error}`)
            }
        }
    }catch(error){
        console.log('Ocurrio un error cargando los modulos')
    }
    finally{
        return modulos;
    }
}
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

// Genera y muestra el código QR en la terminal
client.on('qr', (qr) => {
    console.log('QR recibido: ', qr);
    qrcode.generate(qr, { small: true });
});

// Indica que el cliente está listo
client.on('ready', () => {
    console.log('¡Cliente está listo!');
});

// Manejo de mensajes entrantes
client.on('message_create', async (message) => {
    // Ignorar mensajes enviados por el bot
    if (message.from === client.info.wid.user) {
        return;
    }

    // Verifica comandos
    const [command] = message.body.trim().split(" "); // Agarra la primera sección separada por espacios

    if (command in commandMap) {
        const userId = message.from;
        const currentTime = new Date();
        const formattedTime = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
        console.log(`${userId} - ${formattedTime} - Llamando a ${commandMap[command].name || command}...`);

        // Llama a la función correspondiente
        await commandMap[command](client, message);
    }
});

// Unirse a grupos automáticamente por invitación
client.on('group_invite', async (notification) => {
    console.log(`Unido al grupo: ${notification.id}`);
    await client.acceptGroupInvite(notification.id);
});

// Inicializa el cliente
client.initialize();
