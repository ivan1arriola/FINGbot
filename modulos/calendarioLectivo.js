const moment = require('moment'); // Asegúrate de tener moment.js instalado

const sendCalendarioLectivo = async (client, message, args) => {
    try {
        const now = moment(); // Fecha actual

        // Verificar si todos los eventos ya han pasado
        const ultimoExamenFin = moment('2024-12-21');
        if (now.isAfter(ultimoExamenFin)) {
            await client.sendMessage(message.from, '🎉 ¡Feliz año nuevo 2025! 🎉');
            return; // Finalizar aquí si ya pasó todo
        }

        // Definición de las fechas
        const fechas = {
            cursos: {
                primerSemestre: { inicio: moment('2024-03-04'), fin: moment('2024-07-15') },
                segundoSemestre: { inicio: moment('2024-08-05'), fin: moment('2024-12-03') },
            },
            parciales: [
                { inicio: moment('2024-04-27'), fin: moment('2024-05-08'), descripcion: 'Parcial 1 (1er Semestre)' },
                { inicio: moment('2024-05-11'), fin: moment('2024-05-11'), descripcion: 'Parcial 2 (1er Semestre)' },
                { inicio: moment('2024-07-04'), fin: moment('2024-07-15'), descripcion: 'Parcial 3 (1er Semestre)' },
                { inicio: moment('2024-09-21'), fin: moment('2024-10-01'), descripcion: 'Parcial 1 (2do Semestre)' },
                { inicio: moment('2024-10-05'), fin: moment('2024-10-05'), descripcion: 'Parcial 2 (2do Semestre)' },
                { inicio: moment('2024-11-22'), fin: moment('2024-12-03'), descripcion: 'Parcial 3 (2do Semestre)' }
            ],
            examenes: [
                { inicio: moment('2024-01-29'), fin: moment('2024-03-02'), descripcion: 'Exámenes Febrero' },
                { inicio: moment('2024-07-16'), fin: moment('2024-08-03'), descripcion: 'Exámenes Julio' },
                { inicio: moment('2024-12-04'), fin: moment('2024-12-21'), descripcion: 'Exámenes Diciembre' }
            ]
        };

        // Filtrar fechas pasadas
        const parcialesFuturos = fechas.parciales.filter(p => p.fin.isAfter(now));
        const examenesFuturos = fechas.examenes.filter(e => e.fin.isAfter(now));

        // Construir el mensaje
        let mensaje = `📅 *Calendario Lectivo 2024*\n\n`;

        // Agregar fechas de cursos
        mensaje += `🔹 *Cursos*\n`;
        if (fechas.cursos.primerSemestre.fin.isAfter(now)) {
            mensaje += `- Primer Semestre: 04.03.2024 - 15.07.2024\n`;
        }
        if (fechas.cursos.segundoSemestre.fin.isAfter(now)) {
            mensaje += `- Segundo Semestre: 05.08.2024 - 03.12.2024\n`;
        }

        // Agregar fechas de parciales
        if (parcialesFuturos.length > 0) {
            mensaje += `\n🔹 *Parciales*\n`;
            parcialesFuturos.forEach(parcial => {
                mensaje += `- ${parcial.descripcion}: ${parcial.inicio.format('DD.MM.YYYY')} - ${parcial.fin.format('DD.MM.YYYY')}\n`;
            });
        }

        // Agregar fechas de exámenes
        if (examenesFuturos.length > 0) {
            mensaje += `\n🔹 *Exámenes*\n`;
            examenesFuturos.forEach(examen => {
                mensaje += `- ${examen.descripcion}: ${examen.inicio.format('DD.MM.YYYY')} - ${examen.fin.format('DD.MM.YYYY')}\n`;
            });
        }

        // Enviar el mensaje
        await client.sendMessage(message.from, mensaje);

    } catch (error) {
        console.error('Error al enviar el calendario lectivo:', error);
        await client.sendMessage(message.from, "Lo siento, ocurrió un error al obtener el calendario lectivo.");
    }
};

// Exportar el comando en el formato adecuado
module.exports = [
    { name: 'calendariolectivo', func: sendCalendarioLectivo, info: 'Obtiene información sobre las fechas de cursos, parciales y exámenes.', args: [] }
];
