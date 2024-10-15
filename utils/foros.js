const axios=require('axios')
const cheerio=require('cheerio')
const readline = require('readline')
async function getForumLastReplies(forum_id,limit){
    const url=`https://eva.fing.edu.uy/mod/forum/view.php?id=${forum_id}`
    let r;
    try{
        r=await axios.get(url)
    }catch{
     return [] 
    }
    try{
    const $=cheerio.load(r.data);
    const publicaciones=$('th').map(function(){
        let publicacion=$(this).find('a')
        return {
              titulo:publicacion.attr('title'),
              url:publicacion.attr('href')  
        }
    }).toArray().filter(e=>e.titulo)
    }catch{
        return []
    }
    return limit?publicaciones.slice(0,limit+1):publicaciones;
}
module.exports=getForumLastReplies
