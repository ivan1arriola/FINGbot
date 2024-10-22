const axios=require('axios')
const { MessageMedia } = require('whatsapp-web.js')
const fs=require('fs')
const fsAsync = fs.promises
if(fs.existsSync('pokemons.json')){
    var inventory=JSON.parse(fs.readFileSync('pokemons.json','utf-8'))
}else{
    var inventory={}
}
var chats={}
let template={
    name:'Test',
    alias:[],
    winner:'Ganador',
    ev:null
}

let inventory_player={
    pokemons:[]
}
async function getChatId(message){
    let chat=await message.getChat()
    return chat.id._serialized
    
}
async function save(){
    fsAsync.writeFile('pokemons.json',JSON.stringify(inventory))
}
async function addPlayerPokemon(author,pokemon){
    let store={pokemones:inventory[author]?inventory[author].pokemones:{}}
    store.pokemones[pokemon.name]=store.pokemones[pokemon.name]?store.pokemones[pokemon.name]+1:1
    inventory[autor]=store
}
function randInt(max){
    return Math.floor(Math.random()*max)
}

async function stopGame(client,message){
    await message.reply('Juego terminado')
    let chatid=getChatId(message)
    if(chats[chatid]){
        delete chats[chatid]
    }
}
async function addGame(client,message,chatid,name,alias){
    chats[chatid]=template
    chats[chatid].alias=alias
    chats[chatid].name=name
    chats[chatid].winner=''
    chats[chatid].ev=setTimeout(stopGame,1000*300,client,message)
}
async function createGame(client,message,args){
    let chatid=await getChatId(message)
    if(chatid in chats && chats[chatid].winner=='') return await message.reply('Ya hay un juego en curso') 
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
    await addGame(client,message,chatid,pokemon_name,alias)
    let media=await  MessageMedia.fromUrl(pokemon_image)
    const msg=`Adivina el pokemon con !guess <nombre>`
    await message.reply(msg,null,{media:media})
}
async function tryGuess(client,message,args){
   let chatid=await getChatId(message)
   let cid=chats[chatid]
   let autor=message.author
   if(!cid) return await message.reply('No hay ninguna partida en curso')
   if(cid.winner) return await message.reply(`Ya han ganado`)

   r=args[0]
   r=r.toLowerCase()
   if(cid.alias.some(alias=>alias==r)){
       if(cid.ev){
           clearTimeout(cid.ev);
           chats[chatid].ev=null;
           await addPlayerPokemon(autor,cid)

       }
       cid.winner=autor
       await save()
       console.log(`Ganador: ${autor}(En:${chatid}`)
       await message.reply('Has adivinado el Pokemon')

   }else{
       await message.reply('No es el pokemon ese')
   }
}
async function getPokemonList(client,message){
    let author=message.author
    if(!inventory[author]) return await message.reply('No tienes pokemones cazados')
    let pokemones=Object.keys(inventory[author].pokemones).map(pokemonName=>`${pokemonName} (x${inventory[author].pokemones[pokemonName]})`).join('\n')
    return await message.reply(`Pokemones:\n${pokemones}`)

    
}
module.exports=[
       {name:'pokeguesser',func:createGame,info:'Crea instancia de PokeGuesser'},
       {name:'guess',func:tryGuess,info:'Intenta adivinar un pokemon',args:[{name:'pokemon',info:'Nombre del Pokemon',required:true}]},
       {name:'pokedex',func:getPokemonList,info:'Obtiene una lista de pokemones'}
       ]
