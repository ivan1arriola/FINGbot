// Importar dependencias
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { cargarModulos } = require('./utils/moduloUtils.js');
const { procesarMensaje } = require('./eventos/message.js');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        product: 'chrome',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--headless'
        ],
    },
});

client.initialize();

// Cargar módulos
const commandMap = cargarModulos('modulos');
console.log('Comandos cargados:\n' + Object.keys(commandMap).join('\n'));

// Evento para mostrar el código QR
client.on('qr', async (qr) => {
    console.log('QR recibido: ');
    qrcode.generate(qr, { small: true });
});

// Evento cuando el cliente está listo
client.on('ready', () => {
    console.log('¡Cliente está listo! 🚀');
});

// Evento para mensajes eliminados por todos
client.on('message_revoke_everyone', async (message) => {
    if (message.fromMe) return;
    await client.sendMessage(message.from, '🚨🚨🚨 Alguien eliminó un mensaje en este chat. 🚨🚨🚨');
});

// Manejo de mensajes entrantes
client.on('message', (message) => procesarMensaje(client, message, commandMap));

// Eventos de autenticación
client.on('authenticated', () => {
    console.log('Client is authenticated!');
});
client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});
