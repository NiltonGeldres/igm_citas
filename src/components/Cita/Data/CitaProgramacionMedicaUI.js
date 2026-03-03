import { CalendarDays, Clock3 } from 'lucide-react';

const CONFIG_VISUAL_PROGRAMACION = {
  iconos: {
    fecha: <CalendarDays size={16} />,
    horario: <Clock3 size={16} />
  },
  estilos: {
    tarjeta: "p-3 border rounded-xl hover:border-primary transition-all bg-white shadow-sm",
    badgeTurno: "badge bg-primary-subtle text-primary"
  }
};

export const transformarProgramacion = (apiData) => {
  if (!Array.isArray(apiData)) return [];

  return apiData.map((prog) => {
    // Extraemos componentes de la fecha string "YYYYMMDD"
    const anioStr = prog.fecha.substring(0, 4);
    const mesStr = prog.fecha.substring(4, 6);
    const diaStr = prog.fecha.substring(6, 8);

    // Convertimos a objeto Date (Mes es base 0 en JS)
    const fechaObj = new Date(
      parseInt(anioStr), 
      parseInt(mesStr) - 1, 
      parseInt(diaStr)
    );

    // Formateo amigable: "Mié, 02 Mar"
    const fechaFormateada = new Intl.DateTimeFormat('es-PE', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short' 
    }).format(fechaObj);

    return {
      // 1. Data original
      ...prog,

      // 2. Mapeo simplificado e IDs
      id: prog.idProgramacionMedica,
      
      // 3. CAMPOS NUEVOS PARA EL CALENDARIO (Uso en el .some())
      fechadia: parseInt(diaStr),
      fechames: parseInt(mesStr) - 1, // Normalizado a 0-11 para coincidir con Date.getMonth()
      fechaanio: parseInt(anioStr),

      // 4. Formateo de Negocio para visualización
      fechaPresentacion: fechaFormateada,
      rangoHorario: `${prog.horaInicio} - ${prog.horaFin}`,
      tiempoAtencion: `${prog.tiempoPromedioAtencion} min`,

      // 5. Inyección de UI
      iconoFecha: CONFIG_VISUAL_PROGRAMACION.iconos.fecha,
      iconoReloj: CONFIG_VISUAL_PROGRAMACION.iconos.horario,
      claseTarjeta: CONFIG_VISUAL_PROGRAMACION.estilos.tarjeta,
      
      // 6. Flags de estado
      esFinDeSemana: fechaObj.getDay() === 0 || fechaObj.getDay() === 6,
    };
  });
};

/*
import { CalendarDays, Clock3, CalendarClock } from 'lucide-react';

const CONFIG_VISUAL_PROGRAMACION = {
  iconos: {
    fecha: <CalendarDays size={16} />,
    horario: <Clock3 size={16} />
  },
  estilos: {
    tarjeta: "p-3 border rounded-xl hover:border-primary transition-all bg-white shadow-sm",
    badgeTurno: "badge bg-primary-subtle text-primary"
  }
};

export const transformarProgramacion = (apiData) => {
  if (!Array.isArray(apiData)) return [];

  return apiData.map((prog) => {
    // Convertimos fecha YYYYMMDD a objeto Date
    const fechaObj = new Date(
      prog.fecha.substring(0, 4), 
      prog.fecha.substring(4, 6) - 1, 
      prog.fecha.substring(6, 8)
    );

    // Formateo amigable: "Mié, 02 Mar"
    const fechaFormateada = new Intl.DateTimeFormat('es-PE', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short' 
    }).format(fechaObj);

    return {
      // 1. Data original
      ...prog,

      // 2. Mapeo simplificado
      id: prog.idProgramacionMedica,
      
      // 3. Formateo de Negocio
      fechaPresentacion: fechaFormateada,
      rangoHorario: `${prog.horaInicio} - ${prog.horaFin}`,
      tiempoAtencion: `${prog.tiempoPromedioAtencion} min`,

      // 4. Inyección de UI
      iconoFecha: CONFIG_VISUAL_PROGRAMACION.iconos.fecha,
      iconoReloj: CONFIG_VISUAL_PROGRAMACION.iconos.horario,
      claseTarjeta: CONFIG_VISUAL_PROGRAMACION.estilos.tarjeta,
      
      // 5. Flags de estado
      esFinDeSemana: fechaObj.getDay() === 0 || fechaObj.getDay() === 6,
    };
  });
};

*/