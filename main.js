const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
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
    // Ignora los mensajes enviados por el bot
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

    // Responder a mensajes de prueba
    if (message.body === '!ping') {
        message.reply('pong 🏓');
    }

    if (message.body === '!hola') {
        message.reply('¡Hola! 👋');
    }

    if (message.body === '!ayuda') {
        // Responde con un mensaje de ayuda más detallado
        message.reply(
            '¡Hola! Soy un bot de WhatsApp que puede ayudarte a obtener información sobre exámenes y noticias de la FING.\n\n' +
            'Aquí tienes los comandos que puedes utilizar:\n' +
            '1. **!examenes** - Obtén información sobre los exámenes programados.\n' +
            '2. **!noticias** - Recibe las últimas noticias de la Facultad de Ingeniería.\n' +
            '3. **!parciales** - Consulta los calendarios de parciales.\n' +
            '4. **!ping** - Prueba que el bot está activo.\n' +
            '5. **Gracias** - Respuesta de agradecimiento del bot.\n' +
            '6. **Adiós**, **Chau**, **Bye** - Despedidas y respuestas del bot.\n\n' +
            'Si necesitas más información, no dudes en preguntar. ¡Estoy aquí para ayudarte! 😊'
        );
    }

    // Responder a mensajes de agradecimiento
    if (message.body === 'Gracias') {
        message.reply('¡De nada! 😊');
    }

    // Responder a mensajes de despedida
    if (message.body === 'Adiós') {
        message.reply('¡Hasta luego! 👋');
    }

    if (message.body === 'Chau') {
        message.reply('¡Chau! 👋');
    }

    if (message.body === 'Bye') {
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
