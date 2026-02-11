/**
 * FACTORY FUNCTION: Crea un objeto de programación normalizado.
 */
export const crearProgramacionHorarioDia = (data = {}) => {
    const instancia = {
        id: Number(data.id) || 0,
        idProgramacion: Number(data.idProgramacion) || 0,
        fecha: String(data.fecha || ""), 
        dia: data.dia,
        diaSemana: data.diaSemana,
        horaInicio: data.horaInicio || "",
        horaFin: data.horaFin || "",
        idMedico: data.idMedico,
        idEspecialidad: data.idEspecialidad,
        idServicio: data.idServicio || 0,
        idDepartamento: data.idDepartamento || 0,
        idTurno: Number(data.idTurno) || 0,
        tiempoPromedioAtencion: data.tiempoPromedioAtencion || 0,
        descripcionTurno: data.descripcionTurno || null,
        color: data.color || null,
    };

    return {
        ...instancia,
        getClaveCalendario: () => {
            if (instancia.fecha.length !== 8) return "";
            return `${instancia.fecha.substring(0, 4)}-${instancia.fecha.substring(4, 6)}-${instancia.fecha.substring(6, 8)}`;
        }
    };
};

/**
 * Función para actualizar el turno de forma inmutable.
 */
export const actualizarTurnoEnDia = (dia, nuevoIdTurno) => {
    return crearProgramacionHorarioDia({
        ...dia,
        idTurno: Number(nuevoIdTurno)
    });
};

/**
 * UTILIDAD: Transforma la respuesta del Backend al formato que usa el Calendario (UI)
 */
export const mapearListaAUI = (listaBackend) => {
    return listaBackend.reduce((acc, item) => {
        const diaModelado = crearProgramacionHorarioDia(item);
        const clave = diaModelado.getClaveCalendario();
        
        // Formato para el calendario: { "YYYY-MM-DD": ["1"] o ["libre"] }
        acc[clave] = diaModelado.idTurno !== 0 ? [String(diaModelado.idTurno)] : ['libre'];
        
        return acc;
    }, {});
};