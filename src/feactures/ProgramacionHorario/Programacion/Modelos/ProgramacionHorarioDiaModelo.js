/**
 * Modela un objeto individual de día.
 * Basado en la clase Java: ProgramacionMedicaDiaResponse
 */
export const modelarDia = (data = {}) => {
    const instancia = {
        id: Number(data.id || 0),
        idProgramacion: Number(data.idProgramacion || 0),
        horaInicio: String(data.horaInicio || ""),
        horaFin: String(data.horaFin || ""),
        dia: Number(data.dia || 0),
        diaSemana: String(data.diaSemana || ""),
        fecha: String(data.fecha || ""),
        tiempoPromedioAtencion: Number(data.tiempoPromedioAtencion || 0),
        idServicio: Number(data.idServicio || 0),
        codigoServicio: String(data.codigoServicio || ""),
        idEspecialidad: Number(data.idEspecialidad || 0),
        idMedico: Number(data.idMedico || 0),
        idDepartamento: Number(data.idDepartamento || 0),
        idTurno: Number(data.idTurno || 0),
        descripcionTurno: data.descripcionTurno || null,
        color: data.color || null,
    };

    return {
        ...instancia,
        // Helper para la interfaz de React
        getClaveCalendario: () => {
            const f = instancia.fecha;
            // Si la fecha viene sin guiones (longitud 8: 20260212)
            if (f && f.length === 8) {
                return `${f.substring(0, 4)}-${f.substring(4, 6)}-${f.substring(6, 8)}`;
            }
            // Si ya trae guiones o tiene otro formato, la devolvemos tal cual
            return f;
        }
    };
};

/**
 * Modela el envoltorio completo del mes para envío/recepción.
 * Basado en la clase Java: ProgramacionMedicaMesResponse
 */
export const modelarMes = (original = {}, listaDiasActualizada = null) => {
    // Si pasamos una lista nueva, es para guardar. Si no, procesamos la que viene del back.
    const diasRaw = listaDiasActualizada || original?.ProgramacionMedicaDiaResponse || [];

    return {
        data: {
            totalRegistros: Number(original?.totalRegistros || 0),
            numeroPagina: Number(original?.numeroPagina || 0),
            // Mantenemos el nombre de la propiedad EXACTO a la lista en Java
            ProgramacionMedicaDiaResponse: diasRaw.map(d => {
                // Si ya tiene el método helper, es un modelo; si no, lo convertimos
                const m = d.getClaveCalendario ? d : modelarDia(d);
                
                // Extraemos solo los datos puros (POJO) para Jackson/Java
                const { getClaveCalendario, ...datosPuros } = m;
                return datosPuros;
            })
        }
    };
};

/**
 * Helper para actualizar un turno de forma inmutable
 */
export const actualizarTurnoEnDia = (diaModelado, nuevoIdTurno) => {
    return modelarDia({
        ...diaModelado,
        idTurno: nuevoIdTurno
    });
};


/**
 * Modela el payload para CREAR una nueva programación.
 * Estructura: { fecha, idEspecialidad, idServicio, idMedico, programacion: [], usuario }
 */
export const modelarCrearProgramacion = (datosContexto, listaDiasActualizada) => {
    // 1. Limpiamos la lista de días para el backend
    const programacionLimpia = listaDiasActualizada.map(dia => {
            const m = dia.getClaveCalendario ? dia : modelarDia(dia);
            const { getClaveCalendario, ...datosPuros } = m;
            return datosPuros;
    });

    // 2. Construimos el objeto raíz con los nombres exactos que pide tu JSON
    return {
        fecha: datosContexto.fechaActualFormateada, // Ej: "11022026"
        idEspecialidad: String(datosContexto.idEspecialidad || ""),
        idServicio: String(datosContexto.idServicio || "1"),
        codigoServicio: String(datosContexto.codigoServicio || ""),
        idMedico: String(datosContexto.idMedico || ""),
        programacion: programacionLimpia, // La lista de días
        usuario: datosContexto.usuario || "macuna"
    };
};