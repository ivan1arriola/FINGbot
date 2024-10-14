const getReplies = require('../utils/foros.js')
async function foroRespuestas(client, message){
  let args=message.body.split(' ').slice(1) // saltamos el comando
  if(args.length<1) return await message.reply('Uso !foro <id>');
  let foroid=args[0]
  let respuestas=await getReplies(foroid,3);
  if(respuestas==={}) return await message.reply('Id del foro invalido, verifique que este foro sea publico o valido');
  let text='Ultimas 3 respuestas:\n'
  respuestas.forEach(respuesta=>text+=`${respuesta.titulo} ( ${respuesta.url} )\n`)
  return await message.reply(text)
}
module.exports=foroRespuestas
