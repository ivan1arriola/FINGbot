# FINGbot

FINGbot es un bot que he desarrollado en mi tiempo libre, con el objetivo de generar ingresos para la Facultad de Ingeniería (FING). Para implementar nuevas funcionalidades en el bot, se requiere definir una etiqueta que siempre comienza con "!" y crear una función asíncrona `async (client, message)` que maneje toda la lógica relacionada con dicha etiqueta.

El desarrollo del bot se basa en la biblioteca `whatsapp-web.js`, que permite la interacción eficiente con la plataforma de WhatsApp.

## Estructura de Módulos

Cada módulo del bot debe seguir la siguiente estructura básica:

1. **Nombre del Comando**: Definir un nombre descriptivo para el comando, el cual será utilizado por los usuarios.
   
2. **Función Asíncrona**: Crear una función asíncrona que reciba los parámetros `client`, `message` y `args`, donde:
   - `client`: es la instancia del cliente de WhatsApp.
   - `message`: contiene la información del mensaje recibido.
   - `args`: es un array que contiene los argumentos opcionales proporcionados por el usuario.

3. **Lógica del Comando**: Implementar la lógica necesaria dentro de la función para manejar el comando, incluyendo el manejo de errores y la respuesta al usuario.

4. **Exportación**: Exportar el comando en un formato adecuado, que incluya el nombre, la función y la descripción del comando. La estructura de exportación debe ser similar a la siguiente:

```javascript
module.exports = [
    {
        name: 'nombreDelComando',
        func: async (client, message, args) => {
            // Lógica del comando aquí
        },
        info: 'Descripción del comando',
        args: ['<argumentoOpcional>'], // Argumentos opcionales si los hay
    }
];
```

## Ejemplo de Comando

A continuación se muestra un ejemplo de un comando básico que responde al usuario con un mensaje de saludo:

```javascript
module.exports = [
    {
        name: 'saludar',
        func: async (client, message) => {
            await client.sendText(message.from, '¡Hola! ¿Cómo estás?');
        },
        info: 'Saluda al usuario',
    }
];
```

### Descripción de los scripts en `package.json`:

-  


## Contribuciones

Si deseas contribuir al desarrollo de FINGbot, puedes hacerlo a través de la creación de nuevos módulos o la mejora de los existentes. Para ello, sigue las instrucciones de la sección anterior y envía un *pull request* con tus cambios.

