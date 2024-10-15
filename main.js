const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs')
const path = require('path')
const config = require('./utils/config.js')


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
   const mapcmd = function(arg){return arg.required?`<${cmd.name}>`:`[${cmd.name}]`}
   return `${config.PREFIJO}${command.name} ${command.args!==undefined?(command.args.map(cmd=>mapcmd(cmd)).join(' ')+' '):''}`
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
    if (args.length === 1) {
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
        await commandMap[command].func(client, message);
    } else {
        await client.sendMessage(message.from, `El comando "${command}" no es válido.`);
    }
});


// Unirse a grupos automáticamente por invitación
client.on('group_invite', async (notification) => {
    console.log(`Unido al grupo: ${notification.id}`);
    await client.acceptGroupInvite(notification.id);
});

// Inicializa el cliente
client.initialize();
