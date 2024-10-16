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

/*const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        product: 'chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless'],
    }
});*/
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeter:{
        browser:'firefox'
    }
});

// Cargar módulos 
const commandMap = cargarModulos('modulos');
console.log('Comandos cargados:\n' + Object.keys(commandMap).join('\n')); 
//Cargar las variables de entorno
require('dotenv').config()                                             
//Carga el numero desde el argumento o desde variable de entorno       
let number=process.argv[1]||process.env.number                         
const rl = require('readline').createInterface({input:process.stdin,output:process.stdout})                                                   
//Funcion para preguntar de manera asincronica
const question = (text) => new Promise(resolve=>rl.question(text,resolve));                                                                   
//Booleano para no volver a pedir
let pairingCodeRequested = false;                                      
client.on('qr', async (qr) => {                                            
    if ((process.env.useCode||process.args[2])&& !pairingCodeRequested) {                         
        if(!number){                                                                   
            console.warn("Considera incluir tu numero en el archivo .env")                                                                                
            number=await question("Numero: ")
        }                                                                                                                                             
        const pairingCode = await client.requestPairingCode(number);
        console.log(`Codigo para ${number}: ${pairingCode}`)
        pairingCodeRequested = true;                                       
    }else{
        //Mostrar el codigo QR
        console.log('QR recibido: ');
        qrcode.generate(qr, { small: true });
    }
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
