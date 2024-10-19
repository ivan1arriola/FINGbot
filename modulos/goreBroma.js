const fs = require("fs");
const path = require("path");
const { MessageMedia } = require("whatsapp-web.js");
const sendRandomSticker = require("../utils/sendRandomSticker");
const axios = require("axios");

// Ruta a la carpeta de stickers
const stickersDir = path.join(__dirname, "../stickers");

// Función para enviar un chiste y un sticker
const sendJokeAndSticker = async (client, message) => {
  try {
    // Mensaje inicial
    let msg = "No puedo hacer eso, soy un bot serio. 🤖";
    await client.sendMessage(message.from, msg);

    // Esperar 5 segundos antes del siguiente mensaje
    await new Promise((resolve) => setTimeout(resolve, 5000));

    msg = "¡Pero puedo contarte un chiste! 😄";
    await client.sendMessage(message.from, msg);

    // Esperar otros 5 segundos antes de enviar el chiste
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Obtener un chiste de la API
    axios
      .get("https://v2.jokeapi.dev/joke/Any?lang=es")
      .then(async (response) => {
        if (response.data.error) {
          console.error("Error al obtener el chiste:", response.data.error);
          await client.sendMessage(
            message.from,
            "Lo siento, no pude obtener un chiste en este momento."
          );
          return;
        }

        // Verificar el tipo de chiste
        if (response.data.type === "single") {
          const randomJoke = response.data.joke;
          const emojiJoke = `😂😂 ${randomJoke} 😂😂`;
          await client.sendMessage(message.from, emojiJoke);
        } else if (response.data.type === "twopart") {
          const setup = response.data.setup;
          const delivery = response.data.delivery;

          // Enviar el primer mensaje (setup)
          await client.sendMessage(message.from, `😂 ${setup}`);

          // Esperar un momento antes de enviar el segundo mensaje (delivery)
          setTimeout(async () => {
            await client.sendMessage(message.from, `😂😂 ${delivery} 😂😂`);
          }, 2000); // Puedes ajustar el tiempo de espera en milisegundos
        }
      })
      .catch(async (error) => {
        console.error("Error en la solicitud de chiste:", error);
        await client.sendMessage(
          message.from,
          "Lo siento, ocurrió un error al intentar obtener un chiste."
        );
      });

    // Enviar un sticker aleatorio si hay stickers disponibles
    const stickers = fs.readdirSync(stickersDir);
    if (stickers.length > 0) {
      await sendRandomSticker(stickersDir, client, message);
    } else {
      await client.sendMessage(
        message.from,
        "No tengo stickers disponibles en este momento. 😕"
      );
    }
  } catch (error) {
    console.error("Error al enviar chiste y sticker:", error);
    await client.sendMessage(
      message.from,
      "Ocurrió un error al intentar enviar el chiste y el sticker."
    );
  }
};

// Exporta la función con la estructura adecuada
module.exports = [
  {
    name: "gore",
    func: sendJokeAndSticker,
    info: "Envía un chiste y un sticker",
    args: [],
  },
];
