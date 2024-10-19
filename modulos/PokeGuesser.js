const axios=require('axios')
const { MessageMedia } = require('whatsapp-web.js')
const fs=require('fs')
const fsAsync = fs.promises
const readline = require('readline')
const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
    })
if(fs.existsSync('pokemons.json')){
    var inventory=JSON.parse(fs.readFileSync('pokemons.json','utf-8'))
}else{
    var inventory={}
}
let chats={}
let template={
    name:'Test',
    alias:[],
    winner:'Ganador',
    timer:null
}

let inventory_player={
    pokemons:[]
}
function save(){
    fs.writeFileSync('pokemons.json',JSON.stringify(inventory))
}
function randInt(max){
    return Math.floor(Math.random()*max)
}
function delay(ms,func){
    return new Promise(resolve=>setTimeout(resolve,ms,val));

}
function question(text){
    return new Promise(resolve=>rl.question(text,resolve));
}
async function stopGame(client,message){
    await message.reply('Juego terminado')
    let chat = await message.getChat()
    if(chats[chat.id]){
        delete chats[chat.id]
    }
}
async function createGame(client,message,args){

    let chat=await message.getChat()
    if(chat.id in chats && chats[chat.id].winner=='') return await message.reply('Ya hay un juego en curso') 
    let pokemon_count=(await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1')).data.count
    let pokemon_picked=randInt(pokemon_count)
    let resp=await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${pokemon_picked}`)
    let pokemon_dict=(resp.data.results[0])

    let pokemon_name=pokemon_dict.name
    let pokemon_id=pokemon_dict.url.trim().split('/',7).pop()
    let pokemon_image=`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon_id}.png`.trim()
    let alias=[]
    pokemon_name.split('-').forEach(a=>alias.push(a))
    pokemon_name.split(' ').forEach(a=>alias.push(a))
    alias.push(pokemon_name.replace('-',' '))
    chats[chat.id]=template
    chats[chat.id].alias=alias
    chats[chat.id].name=pokemon_name
    chats[chat.id].winner=''
    chats[chat.id].ev=setTimeout(stopGame,1000*300,client,message)
    let rdata=await axios.get(pokemon_image,{responseType:'blob'})
    await fsAsync.writeFile('foto.png',rdata.data)
    let media=await  MessageMedia.fromFilePath('foto.png')
    await fsAsync.unlink('foto.png')
    await message.reply(media,null,{caption:}`Adivina el pokemon con !guess <nombre>`)
}
async function tryGuess(client,message,args){
   let chat=await message.getChat()
   let cid=chats[chat.id]
   if(!cid) return await message.reply('No hay ninguna partida en curso')
   if(cid.winner) return await message.reply(`Ya han ganado`)

   r=args[0]
   r=r.toLowerCase()
   if(cid.alias.some(alias=>alias==r)){
       if(cid.ev){
           clearTimeout(cid.ev);
           chats[chat.id].ev=null;
           let store={pokemones:inventory[message.author.id]?inventory[message.author.id].pokemones:{}}
           store.pokemones[cid.name]=store.pokemones[cid.name]?store.pokemones[cid.name]+1:1
           inventory[message.author.id]=store

       }
       cid.winner=message.author.id
       save()
       await message.reply('Has adivinado el Pokemon')

   }else{
       await message.reply('No es el pokemon ese')
   }
}
async function getPokemonList(client,message){
    let author=message.author.id
    if(!inventory[author]) return await message.reply('No tienes pokemones cazados')
    let pokemones=Object.keys(inventory[author].pokemones).map(pokemonName=>`${pokemonName} (x${inventory[author].pokemones[pokemonName]})`).join('\n')
    return await message.reply(`Pokemones:\n${pokemones}`)

    
}
module.exports=[
       {name:'pokeguesser',func:createGame,info:'Crea instancia de PokeGuesser'},
       {name:'guess',func:tryGuess,info:'Intenta adivinar un pokemon',args:[{name:'pokemon',info:'Nombre del Pokemon',required:true}]},
       {name:'pokedex',func:getPokemonList,info:'Obtiene una lista de pokemones'}
       ]
