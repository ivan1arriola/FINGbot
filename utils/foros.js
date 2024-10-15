const axios=require('axios')
const cheerio=require('cheerio')
const readline = require('readline')
async function getForumLastReplies(forum_id,limit){
    const url=`https://eva.fing.edu.uy/mod/forum/view.php?id=${forum_id}`
    
    try{
        const r=await axios.get(url)
        const $=cheerio.load(r.data);
        const publicaciones=$('th').map(function(){
        let publicacion=$(this).find('a')
        return {
              titulo:publicacion.attr('title'),
              url:publicacion.attr('href')  
        }
    }).toArray().filter(e=>e.titulo)
    return limit?publicaciones.slice(0,limit+1):publicaciones;
    }catch{
        return []
    }
}
module.exports=getForumLastReplies
