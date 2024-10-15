// calendarioLectivo.js

const moment = require('moment'); // Asegúrate de tener moment.js instalado

const sendCalendarioLectivo = async (client, message, args) => {
    const now = moment(); // Fecha actual

    // Definición de las fechas
    const fechas = {
        cursos: {
            primerSemestre: { inicio: moment('2024-03-04'), fin: moment('2024-07-15') },
            segundoSemestre: { inicio: moment('2024-08-05'), fin: moment('2024-12-03') },
        },
        parciales: [
            { inicio: moment('2024-04-27'), fin: moment('2024-05-08'), descripcion: 'Primer Parcial 1' },
            { inicio: moment('2024-05-11'), fin: moment('2024-05-11'), descripcion: 'Primer Parcial 2' },
            { inicio: moment('2024-07-04'), fin: moment('2024-07-15'), descripcion: 'Primer Parcial 3' },
            { inicio: moment('2024-09-21'), fin: moment('2024-10-01'), descripcion: 'Segundo Parcial 1' },
            { inicio: moment('2024-10-05'), fin: moment('2024-10-05'), descripcion: 'Segundo Parcial 2' },
            { inicio: moment('2024-11-22'), fin: moment('2024-12-03'), descripcion: 'Segundo Parcial 3' }
        ],
        examenes: [
            { inicio: moment('2024-01-29'), fin: moment('2024-03-02'), descripcion: 'Exámenes Febrero' },
            { inicio: moment('2024-07-16'), fin: moment('2024-08-03'), descripcion: 'Exámenes Julio' },
            { inicio: moment('2024-12-04'), fin: moment('2024-12-21'), descripcion: 'Exámenes Diciembre' }
        ]
    };

    // Determinar el semestre actual
    let semestreActual;
    if (now.isBetween(fechas.cursos.primerSemestre.inicio, fechas.cursos.primerSemestre.fin)) {
        semestreActual = 'Primer Semestre';
    } else if (now.isBetween(fechas.cursos.segundoSemestre.inicio, fechas.cursos.segundoSemestre.fin)) {
        semestreActual = 'Segundo Semestre';
    } else {
        semestreActual = 'Fuera del período académico';
    }

    // Calcular semanas restantes para parciales y exámenes
    const proximosParciales = fechas.parciales.filter(p => p.inicio.isAfter(now)).sort((a, b) => a.inicio - b.inicio);
    const proximosExamenes = fechas.examenes.filter(e => e.inicio.isAfter(now)).sort((a, b) => a.inicio - b.inicio);

    const semanasParaParciales = proximosParciales.length > 0 ? proximosParciales[0].inicio.diff(now, 'weeks') : null;
    const semanasParaExamenes = proximosExamenes.length > 0 ? proximosExamenes[0].inicio.diff(now, 'weeks') : null;

    // Construir el mensaje
    let mensaje = `**${semestreActual}**\n`;
    if (semanasParaParciales !== null) {
        mensaje += `Faltan ${semanasParaParciales} semanas para el próximo período de parciales.\n`;
    }
    if (semanasParaExamenes !== null) {
        mensaje += `Faltan ${semanasParaExamenes} semanas para el próximo período de exámenes.`;
    } else {
        mensaje += `No hay próximos exámenes programados.`;
    }

    // Enviar el mensaje
    await client.sendMessage(message.from, mensaje);
};

// Exportar el comando en el formato adecuado
module.exports = [
    { name: 'calendariolectivo', func: sendCalendarioLectivo, info: 'Obtiene información sobre las fechas de cursos, parciales y exámenes.', args: [] }
];
