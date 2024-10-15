const startTime = new Date();
async function info(client,message,args){                     
      const currentTime = new Date();                       
      const uptime = currentTime - startTime;               
      const days = Math.floor(uptime / (1000 * 60 * 60 * 24));                                                          
      const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));                                  
      const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));                                            
      const nodeVersion = process.version;                 
      const platform = process.platform;                   
      const arch = process.arch;                                                                                        
      await message.reply(`FingBot ha estado corriendo durante: ${days} días, ${hours} horas y ${minutes} minutos.\n`+
                          `Versión de Node.js: ${nodeVersion}\n`+
                          `Plataforma: ${platform}(${arch})`);
}
module.exports={name:'botinfo',
                func:info,
                info:'Ver informacion del bot'}
