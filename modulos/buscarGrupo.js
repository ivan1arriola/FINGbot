const axios = require('axios');
const papa = require('papaparse');
const fuzzysort = require('fuzzysort');

// URL del CSV de grupos
const gruposCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTe19D3V1sjpUCfq53r8ryhbuJdxV3lkOjPMA6CM4YGA0WlU0Py0whT8CiWqky6ZsiAYWMXrqCwJAq0/pub?gid=0&single=true&output=csv';

let grupos = [];

// Función que busca el grupo de WhatsApp en el CSV de grupos
async function buscarGrupo() {
    try {
        const response = await axios.get(gruposCSV);
        papa.parse(response.data, {
            header: true,
            complete: function (results) {
                grupos = results.data;
            },
            error: function (error) {
                console.error('Error al parsear el CSV:', error);
            }
        });
    } catch (error) {
        console.error('Error al obtener el CSV:', error);
    }
}

// Función para buscar grupos por nombre usando fuzzysort
function buscarGrupoPorNombre(nombre) {
    try {
        const resultados = fuzzysort.go(nombre, grupos, { key: 'Nombre' });
        return resultados.map(result => result.obj);
    } catch (error) {
        console.error('Error al buscar el grupo por nombre:', error);
        return [];
    }
}

// Función principal que se exportará
async function buscarGrupoCommand(client, message, args) {
    try {
        await buscarGrupo(); // Asegúrate de que los grupos están cargados

        const nombreABuscar = args.join(' ') || ''; // Unir argumentos
        if (!nombreABuscar) {
            await message.reply("Proporciona un nombre.");
            return;
        }

        const gruposEncontrados = buscarGrupoPorNombre(nombreABuscar);

        if (gruposEncontrados.length > 0) {
            // Respuesta breve con el grupo de mayor relevancia
            const grupo = gruposEncontrados[0];
            const enlace = grupo.GrupodeWhatsApp.includes('whatsapp') ? grupo.GrupodeWhatsApp : grupo.GrupoAlternativo;
            await message.reply(`${grupo.Nombre}: ${enlace}`);
        } else {
            await message.reply("Sin resultados.");
        }
    } catch (error) {
        console.error('Error en el comando buscarGrupoCommand:', error);
        await message.reply("Lo siento, ocurrió un error al buscar el grupo.");
    }
}

// Exportar el comando en el formato adecuado
module.exports = [
    {
        name: 'buscargrupo',
        func: buscarGrupoCommand,
        info: 'Busca grupos de WhatsApp por nombre y devuelve el resultado más relevante.',
        args: [{ name: 'nombre', info: 'Nombre del grupo a buscar', required: true }],
    }
];
