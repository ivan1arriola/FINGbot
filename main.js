const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const checkExamInfo = require('./examen');
const checkNewsInfo = require('./noticias'); // Asegúrate de que tienes un módulo para obtener noticias

const client = new Client();

client.on('qr', (qr) => {
    console.log('QR recibido: ', qr);
    qrcode.generate(qr, { small: true }); // Muestra el QR en la terminal
});

client.on('ready', () => {
    console.log('¡Cliente está listo!');
});

client.on('message_create', async (message) => {
    // Verifica si el mensaje contiene la etiqueta !examenes
    if (message.body.includes('!examenes')) {
        message.reply('Estoy buscando información sobre los exámenes...');
        const examInfo = await checkExamInfo();
        message.reply(examInfo);
    }

    // Verifica si el mensaje contiene la etiqueta !noticias
    if (message.body.includes('!noticias')) {
        message.reply('Estoy buscando información sobre las noticias...');
        const newsInfo = await checkNewsInfo(); // Asegúrate de que este módulo exista
        message.reply(newsInfo);
    }

    // Responder a mensajes de prueba
    if (message.body === '!ping') {
        message.reply('pong');
    }
});

// Inicializa el cliente
client.initialize();
