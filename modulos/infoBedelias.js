// infoBedelias.js

async function getInfoBedelia(client, message, args) {
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
  { 
      name: 'infobedelias', 
      func: getInfoBedelia, 
      info: 'Obtiene información sobre Bedelía', 
      args: [] 
  }
];
