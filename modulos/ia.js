const model="DANGODxH0b934"
const customPrompt=`
Eres un estudiante de ingenieria


`
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function buildResponse(message,useModel,model,promptMsg){
  return {
  "messages": [
    message
  ],
  "previewToken": null,
  "codeModelMode": true,
  "agentMode": useModel?{
    "mode":useModel?true:false,
    "id":model,
    "name":"GOD"}:{},
  "trendingAgentMode": {},
  "isMicMode": false,
  "maxTokens": 1024,
  "playgroundTopP": 0.9,
  "playgroundTemperature": 0.5,
  "isChromeExt": false,
  "githubToken": null,
  "clickedAnswer2": false,
  "clickedAnswer3": false,
  "clickedForceWebSearch": false,
  "visitFromDelta": false,
  "userSystemPrompt":  promptMsg,
  "mobileClient": false,
  "userSelectedModel": null
  }
}

const generateAlphanumericString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

function getMessage(content,role){
  return {"id":generateAlphanumericString(10),
          "content":content,
          "role":(role==undefined)?"user":role
         }
}
async function ask(text,model,prompt){
    let response=buildResponse(getMessage(text),model?true:false,model,prompt?prompt:null)
    let r=await axios.post("https://blackbox.ai/api/chat",response);
    let result=r.data;
    return result
}
async function chat(client,msg,args){
   let text=await ask(args.join(' '))
   await msg.reply(text);

}
async function dan(client,msg,args){
    let text=await ask(args.join(' '),model)
    await msg.reply(text)
}
async function custom(client,msg,args){
    let text=await ask(args.join(' '),model,customPrompt)
    await msg.reply(text)
}

module.exports=[
     {name:'ia',
     func:chat,
     info:'Habla con la IA',args:[{name:'mensaje',info:'Mensaje que enviarle',required:true}]},
     {name:'dan',
     func:dan,
     info:'Habla con la IA(Agresiva)',args:[{name:'mensaje',info:'Mensaje que enviarle',required:true}]},
     {name:'iafing',
      func:custom,
      info:'IA Personalizada para estudiantes',
      args:[{name:'mensaje',info:'Mensaje que enviarle',required:true}]
    }
]

