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

// Inicializar cliente con manejo de errores
try {
    client.initialize();
} catch (error) {
    console.error('Error al inicializar el cliente: ', error.message);
}

// Cargar módulos
let commandMap;
try {
    commandMap = cargarModulos('modulos');
    console.log('Comandos cargados:\n' + Object.keys(commandMap).join('\n'));
} catch (error) {
    console.error('Error al cargar los módulos: ', error.message);
}

// Evento para mostrar el código QR
client.on('qr', async (qr) => {
    try {
        console.log('QR recibido: ');
        qrcode.generate(qr, { small: true });
    } catch (error) {
        console.error('Error al generar QR: ', error.message);
    }
});

// Evento cuando el cliente está listo
client.on('ready', () => {
    console.log('¡Cliente está listo! 🚀');
});

// Evento para mensajes eliminados por todos
client.on('message_revoke_everyone', async (message) => {
    if (message.fromMe) return;
    try {
        await client.sendMessage(message.from, '🚫 Este mensaje ha sido eliminado por el remitente.');
    } catch (error) {
        console.error('Error al enviar mensaje de revocación: ', error.message);
    }
});

// Manejo de mensajes entrantes
client.on('message', (message) => {
    try {
        procesarMensaje(client, message, commandMap);
    } catch (error) {
        console.error('Error al procesar el mensaje: ', error.message);
    }
});

// Eventos de autenticación
client.on('authenticated', () => {
    console.log('Cliente autenticado correctamente.');
});

client.on('auth_failure', (msg) => {
    console.error('FALLO DE AUTENTICACIÓN', msg);
});
