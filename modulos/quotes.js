const axios=require('axios')
const url='https://quotes-api-three.vercel.app/api/randomquote?language=es'
async function getQuote(client,message,args){
  const response=await axios.get(url)
  let text=`${response.data.quote}
- ${response.data.author}`
  try{
    await message.reply(text)
  }catch(error){
    await client.sendMessage(message.from,text)
  }
}
module.exports =[
  {name:'quote',
   func:getQuote,
   info:'Obtiene una cita celebre'
  }
]
