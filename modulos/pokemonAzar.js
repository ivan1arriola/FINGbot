const fetch = require('node-fetch');
const { MessageMedia } = require('whatsapp-web.js');
const sharp = require('sharp');
const generaciones = {}; // Objeto para almacenar los Pokémon de cada generación

const idioma = { language: 'es' }; // Idioma para la API de Pokédex

// Función para precargar los Pokémon de todas las generaciones
const precargarGeneraciones = async () => {
    const Pokedex = (await import('pokedex-promise-v2')).default; // Importación dinámica
    const P = new Pokedex();

    const generacionesLista = await P.getGenerationsList(idioma);
    console.log('Precargando Pokémon de todas las generaciones...');

    for (const generacion of generacionesLista.results) {
        const generacionData = await P.getGenerationByName(generacion.name);
        const pokemones = generacionData.pokemon_species.map(pokemon => pokemon.name);
        generaciones[generacionData.id] = pokemones; // Almacena los Pokémon en el objeto `generaciones`
    }
};

// Llamar a la función de precarga al iniciar
precargarGeneraciones();

// Función para obtener un Pokémon aleatorio
const obtenerPokemonAleatorio = (generacion) => {
    if (generacion) {
        // Seleccionar un Pokémon aleatorio de la generación especificada
        const pokemonDeGeneracion = generaciones[generacion];
        if (!pokemonDeGeneracion || pokemonDeGeneracion.length === 0) {
            throw new Error(`No se encontraron Pokémon para la generación ${generacion}.`);
        }
        const randomIndex = Math.floor(Math.random() * pokemonDeGeneracion.length);
        return pokemonDeGeneracion[randomIndex];
    } else {
        // Seleccionar un Pokémon aleatorio de todas las generaciones
        const allPokemons = Object.values(generaciones).flat();
        if (allPokemons.length === 0) {
            throw new Error('No se encontraron Pokémon en ninguna generación.');
        }
        const randomIndex = Math.floor(Math.random() * allPokemons.length);
        return allPokemons[randomIndex];
    }
};

// Función para obtener la imagen del Pokémon
async function obtenerImagenPokemon(urlImage) {
    const response = await fetch(urlImage);
    if (!response.ok) throw new Error('Error al obtener la imagen del Pokémon');
    return await response.buffer();
}

// Función para convertir la imagen a WebP y enviarla como sticker
async function enviarStickerPokemon(client, message, pokemonData) {
    const pokemonName = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
    const urlImage = pokemonData.sprites.other['official-artwork'].front_default;

    try {
        // Obtener la imagen en buffer
        const imageBuffer = await obtenerImagenPokemon(urlImage);

        // Convertir la imagen a WebP
        const webpBuffer = await sharp(imageBuffer)
            .resize(512, 512) // Cambia el tamaño si lo deseas
            .toFormat('webp')
            .toBuffer();

        // Crear un objeto MessageMedia para el sticker
        const media = new MessageMedia('image/webp', webpBuffer.toString('base64'), `${pokemonName} Sticker`);

        // Enviar el sticker
        await client.sendMessage(message.from, media, { sendMediaAsSticker: true });

        // Enviar un mensaje adicional confirmando el envío del sticker
        await client.sendMessage(message.from, `¡Aquí tienes un sticker de ${pokemonName}!`);
    } catch (error) {
        console.error('Error al enviar el sticker de Pokémon:', error);
        await client.sendMessage(message.from, 'Hubo un error al enviar el sticker. Intenta nuevamente.');
    }
}

// Función principal para manejar el comando
async function sendPokemonInfo(client, message, args) {
    const generacion = args[0] ? args[0] : null; // Obtener la generación del primer argumento (opcional)

    // Validar el parámetro de generación si se proporciona
    if (generacion && (isNaN(generacion) || generacion < 1 || generacion > 9)) {
        await client.sendMessage(message.from, 'Por favor, proporciona una generación válida (1-9).');
        return;
    }

    try {
        const pokemon = obtenerPokemonAleatorio(generacion); // Obtén un Pokémon aleatorio

        const Pokedex = (await import('pokedex-promise-v2')).default; // Importar nuevamente la clase Pokedex
        const P = new Pokedex(); // Inicializar `P`
        const pokemonData = await P.getPokemonByName(pokemon); // Obtén los detalles del Pokémon

        const pokemonInfo = `Aquí tienes a ${pokemonData.name.toUpperCase()}!
        Tipo: ${pokemonData.types.map(type => type.type.name).join(', ')}
        Altura: ${pokemonData.height / 10} m
        Peso: ${pokemonData.weight / 10} kg`;

        // Enviar el mensaje de información
        await client.sendMessage(message.from, pokemonInfo);

        // Enviar el sticker
        await enviarStickerPokemon(client, message, pokemonData);
    } catch (error) {
        console.error('Error al obtener Pokémon:', error);
        await client.sendMessage(message.from, 'Hubo un error al obtener el Pokémon. Intenta nuevamente.');
    }
}

// Exporta la función con la estructura adecuada
module.exports = [
    {
        name: 'pokemon',
        func: sendPokemonInfo,
        info: 'Envía un Pokémon aleatorio y su información como sticker. Usa un número (1-9) para especificar la generación.',
        args: [{ name: 'generación', info: 'Número de generación (opcional)' }]
    }
];

// Iniciar la precarga
precargarGeneraciones();
