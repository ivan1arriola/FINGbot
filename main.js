const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs')
const path = require('path')
const config = require('./utils/config.js')
const detectarHackeo = require('./utils/detectarHackeo.js');


// Cargar módulos
function loadModules(modulos_dir){
    modulos = {}
    try{
    files=fs.readdirSync(path.join(__dirname,modulos_dir))
    
        for(const file of files){
            try{
                modulo = require(path.join(__dirname,modulos_dir,file))
                for(const cmd of modulo){
                    modulos[cmd.name]=cmd
                }
            }catch(error){
                console.log(`No se pudo cargar el modulo ${file}: ${error}`)
            }
        }
    }catch(error){
        console.log('Ocurrio un error cargando los modulos')
    }
    finally{
        return modulos;
    }
}

const commandMap = loadModules('modulos')


function usage(command){
   const maparg = function(arg){return arg.required?`<${arg.name}>`:`[${arg.name}]`}
   return `${config.PREFIJO}${command.name} ${command.args!==undefined?(command.args.map(arg=>maparg(arg)).join(' ')+' '):''}`
}

function listParameters(command){
    function getarg(arg){
        return `> ${arg.name} - ${arg.info}`
    }
    if(!command.args || command.args.length<1) return ""
    let text=`Parametros:\n${command.args.map(arg=>getarg(arg)).join('\n')}`
    return text;
}

// Definir sendHelp antes de su uso
const sendHelp = async (client, message, args) => {
    if (args && args.length === 1 && args[0].trim().length>0) {
        let command = args[0].toLowerCase();
        if (commandMap[command]) {
            command = commandMap[command];
            return await message.reply(`Ayuda: ${usage(command)} - ${command.info}\n${listParameters(command)}`);
        } else {
            return await message.reply(`Comando desconocido: ${command}`);
        }
    }

    const helpMessage = `*Lista de comandos disponibles:*\n` +
        `${Object.keys(commandMap).map((comando, indice) => `${indice + 1}. ${usage(commandMap[comando])} - ${commandMap[comando].info}`).join('\n')}\n` +
        `Símbolos: <> - requerido, [] - opcional`;

    // Enviar el mensaje de ayuda
    await client.sendMessage(message.from, helpMessage);
};


// Agregar el comando de ayuda al mapeo
commandMap['help'] = {
    name: 'help',
    func: sendHelp,
    info: 'Muestra la lista de comandos disponibles',
    args: [{name:'comando',info:'Ver ayuda especifica de un comando'}]
};

console.log('Comandos cargados:', Object.keys(commandMap).join(', '));



const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

// Genera y muestra el código QR en la terminal
client.on('qr', (qr) => {
    console.log('QR recibido: ', qr);
    qrcode.generate(qr, { small: true });
});

// Indica que el cliente está listo
client.on('ready', () => {
    console.log('¡Cliente está listo!');
});

client.on('message_create', async (message) => {
    // Ignorar mensajes enviados por el bot
    if (message.from === client.info.wid.user) {
        return;
    }

    // Verificar si el cuerpo del mensaje es una cadena antes de manipularla
    if (typeof message.body !== 'string') {
        console.log('El mensaje no contiene texto, es probable que sea un archivo multimedia o vacío.');
        return;
    }

    // Ignorar el texto que no es comando
    if (!message.body.trim().startsWith(config.PREFIJO)) {
        return;
    }

    // Comprobar si el mensaje es sospechoso
    if (detectarHackeo(message)) {
        await message.reply("Se ha detectado un comportamiento sospechoso en tu mensaje. 😠😡 Tu acceso ha sido registrado.");

        // Guardar información del usuario
        const userInfo = {
            from: message.from,
            timestamp: new Date().toISOString(),
            body: message.body,
            isFromMe: message.fromMe,
            hasMedia: message.hasMedia,
            isForwarded: message.isForwarded,
            mentionedIds: message.mentionedIds
        };

        // Guardar en un archivo JSON
        const filePath = path.join(__dirname, 'sospechosos.json');

        // Leer el archivo existente o crear uno nuevo
        let data = [];
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath);
            data = JSON.parse(fileData);
        }

        // Agregar el nuevo registro
        data.push(userInfo);

        // Guardar de nuevo el archivo
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        
        return; // No procesar el comando
    }


    // Verifica comandos
    const [command] = message.body.trim().toLowerCase().slice(config.PREFIJO.length).split(" "); // Agarra la primera sección separada por espacios

    if (command in commandMap && typeof commandMap[command].func === 'function') {
        const commandObj=commandMap[command];
        const userId = message.from;
        const currentTime = new Date();
        const formattedTime = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
        console.log(`${userId} - ${formattedTime} - Llamando a ${commandMap[command].name || command}...`);
        let args_amount=0
        if(commandObj.args && commandObj.args.length>0){
            args_amount=commandObj.args.length;
        }
        //obtiene los argumentos
        let args=message.body.trim().split(" ").slice(1).join(" ").split(" ",args_amount)
        if(commandObj.min_args && typeof commandObj.min_args =='number' && typeof commandObj.min_args>0 && args.length<commandObj.min_args){
            return await message.reply(usage(commandObj));
        }
        // Llama a la función correspondiente
        await commandMap[command].func(client, message,args);
    } else {
        await client.sendMessage(message.from, `El comando "${command}" no es válido.`);
    }
});

client.on('message_revoke_everyone', async (message) => {
    // Verifica si el mensaje fue eliminado por todos
    if (message.fromMe) {
        return;
    }

    // Enviar un mensaje de advertencia
    await client.sendMessage(message.from, '🚨🚨🚨 Alguien eliminó un mensaje en este chat. 🚨🚨🚨');
});

client.on('message_create', async (message) => {
    const chat = await message.getChat();
    if (chat.isGroup) {
        return;
    }

    if (message.from === client.info.wid.user) {
        return;
    }

    const mensajesAnteriores = await chat.fetchMessages({ limit: 5 });
    if (mensajesAnteriores.length === 0) {
        iniciarChat(client, message, chat);
    }

    const ultimoMensaje = mensajesAnteriores[mensajesAnteriores.length - 1];
    if (ultimoMensaje.fromMe) {
        iniciarChat(client, message, chat);
    }

    // Ultimo mensaje hace mas de 5 minutos
    if (new Date() - ultimoMensaje.timestamp > 5 * 60 * 1000) {
        iniciarChat(client, message, chat);
    }
}
);

async function iniciarChat(client, message, chat) {
    await chat.sendMessage('¡Hola! Soy un bot creado por estudiantes de la FING para ayudarte con información sobre cursos y otras cosas. Si necesitas ayuda, escribe !help.');
}






// Inicializa el cliente
client.initialize();
