const os = require('os');
const startTime = new Date();

async function info(client, message, args) {
    try {
        const currentTime = new Date();
        const uptime = currentTime - startTime;

        // Tiempo de ejecución
        const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));

        // Información del sistema
        const nodeVersion = process.version;
        const platform = process.platform;
        const arch = process.arch;
        const cpuUsage = process.cpuUsage();
        const memoryUsage = process.memoryUsage();
        const osType = os.type();
        const osRelease = os.release();
        const osTotalMemory = os.totalmem();
        const osFreeMemory = os.freemem();
        const cpuModel = os.cpus()[0].model;
        const cpuSpeed = os.cpus()[0].speed;

        const infoMessage = `🔹 *FingBot ha estado corriendo durante:* ${days} días, ${hours} horas y ${minutes} minutos.\n` +
            `🔹 *Versión de Node.js:* ${nodeVersion}\n` +
            `🔹 *Plataforma:* ${platform} (${arch})\n` +
            `🔹 *Uso de CPU:* Usuario ${cpuUsage.user} μs, Sistema ${cpuUsage.system} μs\n` +
            `🔹 *Uso de memoria:* RSS ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB, ` +
            `Heap ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB / ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB\n` +
            `🔹 *Sistema operativo:* ${osType} ${osRelease}\n` +
            `🔹 *Memoria total del sistema:* ${(osTotalMemory / 1024 / 1024 / 1024).toFixed(2)} GB\n` +
            `🔹 *Memoria libre del sistema:* ${(osFreeMemory / 1024 / 1024 / 1024).toFixed(2)} GB\n` +
            `🔹 *Modelo de CPU:* ${cpuModel} (${cpuSpeed} MHz)`;

        await message.reply(infoMessage);
    } catch (error) {
        console.error("Error al obtener información del sistema:", error.message);
        await message.reply("❌ Ocurrió un error al intentar obtener la información del sistema.");
    }
}

module.exports = [
    {
        name: 'infobot',
        func: info,
        info: 'Información sobre el bot y el sistema.',
        args: [],
    }
];
