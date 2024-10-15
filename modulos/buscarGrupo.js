// buscarGrupo.js

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
            }
        });
    } catch (error) {
        console.error('Error al obtener el CSV:', error);
    }
}

// Función para buscar grupos por nombre usando fuzzysort
function buscarGrupoPorNombre(nombre) {
    const resultados = fuzzysort.go(nombre, grupos, { key: 'Nombre' });
    return resultados.map(result => result.obj);
}

// Función principal que se exportará
async function buscarGrupoCommand(client, message, args) {
    await buscarGrupo(); // Asegúrate de que los grupos están cargados

    const nombreABuscar = args.join(' ') || ''; // Unir argumentos
    if (!nombreABuscar) {
        await message.reply("Por favor, proporciona el nombre del grupo.");
        return;
    }

    const gruposEncontrados = buscarGrupoPorNombre(nombreABuscar);

    if (gruposEncontrados.length > 0) {
        // Devolver el grupo de mayor relevancia
        // si el link no es valido, mandar lo que hay en GrupoAlternativo
        if (gruposEncontrados[0].GrupodeWhatsApp.includes('whatsapp')) {
            await message.reply( `Grupo encontrado: ${gruposEncontrados[0].Nombre} - ${gruposEncontrados[0].GrupodeWhatsApp}`);
        } else {
            await message.reply( `Grupo encontrado: ${gruposEncontrados[0].Nombre} - ${gruposEncontrados[0].GrupoAlternativo}`);
        }
    } else {
        await message.reply("No se encontraron grupos relevantes.");
    }
}

// Exportar el comando en el formato adecuado
module.exports = [
    {
        name: 'buscargrupo',
        func: buscarGrupoCommand,
        info: 'Busca grupos de WhatsApp por nombre y devuelve el resultado de mayor relevancia.',
        args: [{name: 'nombre', info: 'Nombre del grupo a buscar', required: true}],
    }
];
