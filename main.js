const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const checkExamInfo = require('./funciones/examen'); // Asegúrate de que este módulo exista
const checkNewsInfo = require('./funciones/noticias'); // Asegúrate de que este módulo exista
const devolverCalendarioParciales = require('./funciones/calendarioParciales'); // Asegúrate de que este módulo exista
const getBedeliaInfo = require('./funciones/bedelia'); // Asegúrate de que este módulo exista
const tomaso = require('./funciones/tomaso'); // Asegúrate de que este módulo exista
const ping = require('./funciones/ping'); // Asegúrate de que este módulo exista
const fechas = require('./funciones/fechas'); // Asegúrate de que este módulo exista
const goreJoke = require('./funciones/gore'); // Asegúrate de que este módulo exista

const sendHelp = async (client, message) => {
    const helpMessage = `*Lista de comandos disponibles:*\n
    1. !examenes\n
    2. !noticias\n
    3. !ping\n
    4. !parciales\n
    5. !Tomaso\n
    6. !tomaso\n
    7. !bedelia\n
    8. !bedelias\n
    9. !fechas\n
    10. !help`;

    // Enviar el mensaje de ayuda
    await client.sendMessage(message.from, helpMessage);
};

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

    
};

// Manejo de mensajes entrantes
client.on('message_create', async (message) => {
    // Ignorar mensajes enviados por el bot
    if (message.from === client.info.wid.user) {
        return;
    }

    // Verifica comandos
    const command = message.body.trim(); // Elimina espacios innecesarios

    if (command in commandMap) {
        const userId = message.from;
        const currentTime = new Date();
        const formattedTime = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
        console.log(`${userId} - ${formattedTime} - Llamando a ${commandMap[command].name || command}...`);

        // Llama a la función correspondiente
        await commandMap[command](client, message);
    }
});

// Inicializa el cliente
client.initialize();

