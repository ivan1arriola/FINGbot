const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const checkExamInfo = require('./examen');
const checkNewsInfo = require('./noticias'); // Asegúrate de que tienes un módulo para obtener noticias
const devolverCalendarioParciales = require('./calendarioParciales'); // Asegúrate de que tienes un módulo para obtener calendarios de parciales

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
        await checkExamInfo(client, message);
    }

    // Verifica si el mensaje contiene la etiqueta !noticias
    if (message.body.includes('!noticias')) {
        await checkNewsInfo(client, message);
    }

    // Responder a mensajes de prueba
    if (message.body === '!ping') {
        // Responde con un mensaje de "pong" con un emoji
        message.reply('pong 🏓');
    }

    if (message.body === '!hola') {
        // Responde con un mensaje de "Hola" con un emoji
        message.reply('¡Hola! 👋');
    }

    if (message.body === '!ayuda') {
        // Responde con un mensaje de ayuda
        message.reply('¡Hola! Soy un bot de WhatsApp que puede ayudarte a obtener información sobre exámenes y noticias de la FING. Prueba enviando !examenes o !noticias para obtener información actualizada.');
    }

    // Responder a mensajes de agradecimiento
    if (message.body === 'Gracias') {
        // Responde con un mensaje de agradecimiento
        message.reply('¡De nada! 😊');
    }

    // Responder a mensajes de despedida
    if (message.body === 'Adiós') {
        // Responde con un mensaje de despedida
        message.reply('¡Hasta luego! 👋');
    }

    // Responder a mensajes de despedida
    if (message.body === 'Chau') {
        // Responde con un mensaje de despedida
        message.reply('¡Chau! 👋');
    }

    // Responder a mensajes de despedida
    if (message.body === 'Bye') {
        // Responde con un mensaje de despedida
        message.reply('Bye! 👋');
    }

    // Calendario de parciales  📅
    if (message.body === '!parciales') {
        message.reply('Estoy buscando información sobre los calendarios de parciales...');
        await devolverCalendarioParciales(client, message);
    }
});

// Inicializa el cliente
client.initialize();

