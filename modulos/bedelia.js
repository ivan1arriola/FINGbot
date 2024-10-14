// bedelia.js

async function getBedeliaInfo(client, message,args) {
    const respuesta = 
`*Departamento de Bedelía* 📚
El Departamento de Bedelía es el encargado de la gestión y administración de la enseñanza en la Facultad de Ingeniería. Entre sus tareas se encuentra la administración de cursos, controles para pruebas e inscripciones, ingresos a facultad, trámites de títulos.

*Horarios de atención presencial:*
- Lunes, miércoles y viernes: 9 a 12 hs
- Martes y jueves: 14 a 17 hs

*Correo de contacto:* bedelia@fing.edu.uy
*Teléfonos:*
- Grado: 2714 2714 int 10113
- Posgrado: 2714 2714 int 10163
    `;
    
    await message.reply(respuesta); // Envía el mensaje formateado
}

module.exports = [
  {name:'bedelia',func:getBedeliaInfo,info:'Obtiene información sobre Bedelia',args:[]}
]
/*
Exportacion de ejemplo 
[{name:'NombreComando',func:mifuncion,info:'Descripcion del comando',args:[{name:'arg1','info':'Descripcion del argumento'}],min_args:n}]
El parámetro func y name son obligatorios
El comando info es opcional pero es recomendable ponerlo(se muestra en !help <comando>) o al usar mal el comando
Si se omite el parametro args o es vacio, el comando no toma parametros(El orden de los parametros es primero los requeridos y luego los opcionales)
Si se omite el parametro min_args o es vacio, se toma como que todos los parametros son opcionales(o 0 en el caso de de que no haya parametros)
La función recibe el cliente, el objeto message y los argumentos
Los argumentos están separados por espacio, ejemplo: !micomando arg1 arg2 argn los argumentos son arg1,arg2 y arg3
Si hay n argumentos especificados en el comando , pero hay mas de n argumentos,
el resto de argumentos se tomará como el último
*/
