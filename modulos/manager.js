const {loadModulo, unloadModulo, reloadModulo} = require('../utils/moduloUtils')
async function cargarModulo(client,message,args,modulos){
    loadModulo("modulos",modulos,args[0]);
    await message.reply("Cargado");

}
async function descargarModulo(client,message,args,modulos){
    unloadModulo(modulos,args[0]);
    await message.reply("Descargado");
}
async function recargarModulo(client,message,args,modulos){
    unloadModulo(modulos,args[0]);
    loadModulo("modulos",modulos,args[0]);
    await message.reply("Recargado");
}

module.exports=[
    {name:'load',
        info:'Cargar un modulo',
        args:[{name:'archivo',info:'Archivo del modulo',required:true}],
        admin:true,
        system:true
    },
    {name:'unload',
        info:'Quitar un modulo',
        args:[{name:'archivo',info:'Archivo del modulo',required:true}],
        admin:true,
        system:true

    },
    {name:'reload',
        info:'Recargar un modulo',
        args:[{name:'archivo',info:'Archivo del modulo',required:true}]
        admin:true,
        system:true
    }
]
