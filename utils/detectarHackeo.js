// detectarHackeo.js

// Función para detectar posibles intentos de hackeo
function detectarHackeo(message) {
    // Expresión regular para detectar patrones sospechosos
    const patronesSospechosos = [
        /(rce|exec|require|child_process|eval|process|spawn|fork|execFile|execSync|eval\(|Function\(|setTimeout|setInterval)/i, // Palabras clave, insensible a mayúsculas
        /\{\$?\$?[ND_FUNC|nd_func]\$\$?/, // Indicios de inyección
        /;|\|\|/ // Delimitadores peligrosos
    ];

    // Verificar si el mensaje contiene patrones sospechosos
    const texto = message.body.toString();
    for (const patron of patronesSospechosos) {
        if (patron.test(texto)) {
            console.warn(`Posible intento de hackeo detectado en el mensaje: "${texto}"`);
            return true; // Retorna verdadero si se detecta un intento
        }
    }
    return false; // Retorna falso si no se detecta nada sospechoso
}

// Guardar datos de usuarios sospechosos
function guardarUsuarioSospechoso(message) {
    const userInfo = {
        from: message.from,
        timestamp: new Date().toISOString(),
        body: message.body,
        isFromMe: message.fromMe,
        hasMedia: message.hasMedia,
        isForwarded: message.isForwarded,
        mentionedIds: message.mentionedIds
    };

    const filePath = path.join(__dirname, 'sospechosos.json');
    let data = [];
    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath);
        data = JSON.parse(fileData);
    }
    data.push(userInfo);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = { detectarHackeo, guardarUsuarioSospechoso };