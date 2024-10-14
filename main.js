const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const checkExamInfo = require('./funciones/examen'); // Asegúrate de que este módulo exista
const checkNewsInfo = require('./funciones/noticias'); // Asegúrate de que este módulo exista
const devolverCalendarioParciales = require('./funciones/calendarioParciales'); // Asegúrate de que este módulo exista
const getBedeliaInfo = require('./funciones/bedelia'); // Asegúrate de que este módulo exista

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

client.on('qr', (qr) => {
    console.log('QR recibido: ', qr);
    qrcode.generate(qr, { small: true }); // Muestra el QR en la terminal
});

client.on('ready', () => {
    console.log('¡Cliente está listo!');
});

client.on('message_create', async (message) => {
    // Ignorar mensajes enviados por el bot
    if (message.from === client.info.wid.user) {
        return;
    }

    // Verifica si el mensaje contiene la etiqueta !examenes
    if (message.body.includes('!examenes')) {
        await checkExamInfo(client, message);
    }

    // Verifica si el mensaje contiene la etiqueta !noticias
    if (message.body.includes('!noticias')) {
        await checkNewsInfo(client, message);
    }

    // Responder a mensajes de ping
    if (message.body === '!ping') {
        message.reply('pong 🏓');
    }

    // Calendario de parciales 📅
    if (message.body === '!parciales') {
        await devolverCalendarioParciales(client, message);
    }

    // Verifica si el mensaje contiene la etiqueta !bedelia
    if (message.body === '!bedelia') {
        await getBedeliaInfo(client, message); // Llama a la función para obtener información de Bedelía
    }
});

// Inicializa el cliente
client.initialize();
