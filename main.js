const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const checkExamInfo = require('./examen');
const checkNewsInfo = require('./noticias'); // Make sure you have a module to get news
const devolverCalendarioParciales = require('./calendarioParciales'); // Make sure you have a module to get partial exam calendars

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

client.on('qr', (qr) => {
    console.log('QR recibido: ', qr);
    qrcode.generate(qr, { small: true }); // Show the QR code in the terminal
});

client.on('ready', () => {
    console.log('¡Cliente está listo!');
});

client.on('message_create', async (message) => {
    // Ignore messages sent by the bot
    if (message.from === client.info.wid.user) {
        return;
    }

    // Check if the message contains the tag !examenes
    if (message.body.includes('!examenes')) {
        await checkExamInfo(client, message);
    }

    // Check if the message contains the tag !noticias
    if (message.body.includes('!noticias')) {
        await checkNewsInfo(client, message);
    }

    // Respond to ping messages
    if (message.body === '!ping') {
        message.reply('pong 🏓');
    }

    // Calendar of partials 📅
    if (message.body === '!parciales') {
        await devolverCalendarioParciales(client, message);
    }

    // Mostrar horarios y correo de bedelía
    if (message.body === '!bedelia') {
        const respuesta = 
`*Departamento de Bedelía* 📚
El Departamento de Bedelía es el encargado de la gestión y administración de la enseñanza en la Facultad de Ingeniería. Entre sus tareas se encuentra la administración de cursos, controles para pruebas e inscripciones, ingresos a facultad, trámites de títulos.

*Horarios de atención presencial:*
- Lunes, miércoles y viernes: 9 a 12 hs
- Martes y jueves: 14 a 17 hs

*Correo de contacto:* bedelia@fing.edu.uy
*Teléfonos:*
- Grado: 2714 2714 int 10113
- Posgrado: 2714 2714 int 10163
        `;
        
        await client.sendMessage(message.from, respuesta); // Envía el mensaje formateado
    }
});

// Initialize the client
client.initialize();
