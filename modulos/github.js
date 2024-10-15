// github.js
// https://github.com/ivan1arriola/FINGbot
// Invita a colaborar en github
async function github(client, message, args) {
    const respuesta =
        `🤖 *¡Colabora con el desarrollo de este bot!*
Si te interesa colaborar con el desarrollo de este bot, puedes hacerlo en el repositorio de GitHub.
- *Repositorio:* [GitHub](https://github.com/ivan1arriola/FINGbot)

Tu apoyo es muy valioso para mejorar este proyecto. ¡Gracias! 🙌`;

    await client.sendMessage(message.from, respuesta);
}

// Exportar el comando en el formato adecuado
module.exports = [
    { name: 'github', func: github, info: 'Invita a colaborar en el repositorio de GitHub' }
];
