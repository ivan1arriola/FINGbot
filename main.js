// Importar dependencias
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { cargarModulos } = require('./utils/moduloUtils.js');
const { procesarMensaje } = require('./eventos/message.js');
const dotenv = require('dotenv');
const readline = require('readline');

// Cargar variables de entorno
dotenv.config();

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        product: 'firefox',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--headless', // Asegúrate de que el modo headless esté activo
            '--remote-debugging-port=9222', // Puedes agregar esto para depuración remota
        ],
    },
});

client.initialize();


// Cargar módulos
const commandMap = cargarModulos('modulos');
console.log('Comandos cargados:\n' + Object.keys(commandMap).join('\n'));

// Cargar el número desde el argumento o desde variable de entorno
let number = process.argv[2] || process.env.NUMBER;

// Crear interfaz para leer desde la consola
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función para preguntar de manera asincrónica
const question = (text) => new Promise(resolve => rl.question(text, resolve));

// Booleano para no volver a pedir el código de emparejamiento
let pairingCodeRequested = false;

// Evento para mostrar el código QR o solicitar código de emparejamiento
client.on('qr', async (qr) => {
    if ((process.env.USE_CODE || process.argv[3]) && !pairingCodeRequested) {
        if (!number) {
            console.warn("Considera incluir tu número en el archivo .env");
            number = await question("Número: ");
        }
        const pairingCode = await client.requestPairingCode(number);
        console.log(`Código para ${number}: ${pairingCode}`);
        pairingCodeRequested = true;
    } else {
        // Mostrar el código QR
        console.log('QR recibido: ');
        qrcode.generate(qr, { small: true });
    }
});

// Evento cuando el cliente está listo
client.on('ready', () => {
    console.log('¡Cliente está listo! 🚀');
    rl.close(); // Cerrar la interfaz de readline una vez que el cliente esté listo
});

// Evento para mensajes eliminados por todos
client.on('message_revoke_everyone', async (message) => {
    if (message.fromMe) return;
    await client.sendMessage(message.from, '🚨🚨🚨 Alguien eliminó un mensaje en este chat. 🚨🚨🚨');
});

// Manejo de mensajes entrantes
client.on('message', (message) => procesarMensaje(client, message, commandMap));

// Inicializar el cliente
client.initialize();


// Eventos de autenticación
client.on('authenticated', () => {
    console.log('Client is authenticated!');
});
client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});