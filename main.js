// Importar dependencias
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { cargarModulos } = require('./utils/moduloUtils.js');
const { procesarMensaje } = require('./eventos/message.js');

/* Inicialización del cliente de WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        product: 'firefox',  // Indicamos que usamos Firefox
        executablePath: '/usr/bin/firefox',  // Ruta de Firefox en tu sistema
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless'], // Ejecutamos en modo headless
    }
});
*/

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        product: 'chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless'],
    }
});


// Cargar módulos 
const commandMap = cargarModulos('modulos');
console.log('Comandos cargados:\n' + Object.keys(commandMap).join('\n')); 


// Muestra el código QR en la terminal
client.on('qr', (qr) => {
    console.log('QR recibido: ');
    qrcode.generate(qr, { small: true });
});

// Indica que el cliente está listo
client.on('ready', async () => {
    console.log('¡Cliente está listo! 🚀');

});

// Evento para mensajes eliminados por todos
client.on('message_revoke_everyone', async (message) => {
    if (message.fromMe) return;
    await client.sendMessage(message.from, '🚨🚨🚨 Alguien eliminó un mensaje en este chat. 🚨🚨🚨');
});

// Manejo de mensajes entrantes
client.on('message', (message) => procesarMensaje(client, message, commandMap));


// Inicializa el cliente
client.initialize();
