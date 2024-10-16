
// Función para procesar el enlace de invitación y unirse al grupo
// joinGroup.js

// Función para procesar el enlace de invitación y unirse al grupo
const joinGroup = async (client, mensaje) => {
    // Usar expresión regular para encontrar el enlace de invitación en el mensaje
    const groupInviteLink = mensaje.body.match(/chat\.whatsapp\.com\/([A-Za-z0-9]+)/);

    if (!groupInviteLink) {
        // Si no encuentra un enlace válido, responde con un error
        await mensaje.reply('No encontré un enlace de invitación válido en el mensaje.');
        return;
    }

    // Extraer solo el código del grupo desde el enlace
    const inviteCode = groupInviteLink[1];
    console.log('Código de invitación:', inviteCode);

    try {
        // Unirse al grupo usando el código extraído
        await client.acceptInvite(inviteCode);
        console.log('Unido al grupo.');

        // Responder al mensaje
        await mensaje.reply('¡Me he unido al grupo!');

    } catch (error) {
        console.error(error);
        await mensaje.reply('No pude unirme al grupo. Asegúrate de que el enlace de invitación sea válido.');
    }
};

// Exportar el módulo con la estructura adecuada
module.exports = [
    {
        name: 'unirse',
        func: joinGroup,
        info: 'Se une a un grupo de WhatsApp usando un enlace de invitación.',
        args: [{name:'enlace',info:'Enlace de invitación al grupo',required:true}],
        min_args:1
    }
];
