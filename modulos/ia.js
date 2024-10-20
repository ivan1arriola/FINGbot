const model="DANGODxH0b934"
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function buildResponse(message,useModel,model){
        return {"messages":[message],
                "previewToken":null,
                "codeModelMode":true,
                "agentMode":useModel?{
                  "mode":useModel?true:false,
                  "id":model,
                  "name":"GOD"}:{},
                "trendingAgentMode":{},
                "isMicMode":false,
                "isChromeExt":false,
                "githubToken":null,
                "clickedAnswer2":false,
                "clickedAnswer3":false,
                "clickedForceWebSearch":false,
                "visitFromDelta":null
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
async function ask(text,model){
    let response=buildResponse(getMessage(text),model?true:false,model)
    let r=await fetch("https://blackbox.ai/api/chat",{
method:"post",
headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.3"},
body:JSON.stringify(response)
    });
    let result=await r.text();
    return result.split("$@$").slice(2).join('$@$')
}
async function chat(client,msg,args){
   let text=await ask(args.join(' '))
   await msg.reply(text);

}
async function dan(client,msg,args){
    let text=await ask(args.join(' '),model)
    await msg.reply(text)
}

module.exports=[
     {name:'ia',
     func:chat,
     info:'Habla con la IA',args:[{name:'mensaje',info:'Mensaje que enviarle'}]},
     {name:'dan',
     func:dan,
     info:'Habla con la IA(Agresiva)',args:[{name:'mensaje',info:'Mensaje que enviarle'}]}
]

