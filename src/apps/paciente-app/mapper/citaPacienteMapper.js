import { User, ShieldCheck } from 'lucide-react';

const CONFIG_VISUAL_CITADDOS = {
  defaultAvatar: <User size={40} className="text-slate-400" />,
  badgeVerificado: <ShieldCheck size={16} className="text-blue-500" />,
  estilos: {
    tarjeta: "border rounded-xl p-3 hover:shadow-md transition-all cursor-pointer",
    monto: "text-success fw-bold fs-5"
  }
};

export const mapearCitaPacienteRequest = (idPaciente, fechaUI) => {
  return {
    idPaciente: idPaciente,
    // Convertimos "2026-03-13" (HTML5) a "20260313" (El Request de Java)
    fecha: fechaUI ? fechaUI.replace(/-/g, '') : ''
  };
};

export const transformarCitas = (apiData) => {
  if (!Array.isArray(apiData)) return [];

return apiData.map((item) => {
    // --- Lógica de Parseo de Fecha ---
    let fechaFormateada = " / / ";
    
    if (item.fecha && item.fecha.length === 8) {
      const anio = parseInt(item.fecha.substring(0, 4));
      const mes = parseInt(item.fecha.substring(4, 6)) - 1; // Mes base 0
      const dia = parseInt(item.fecha.substring(6, 8));
      
      const fechaObj = new Date(anio, mes, dia);

      // Validamos que la fecha sea válida antes de formatear
      if (!isNaN(fechaObj.getTime())) {
        fechaFormateada = new Intl.DateTimeFormat('es-PE', { 
          weekday: 'short', 
          day: '2-digit', 
          month: 'short' 
        }).format(fechaObj).replace('.', ''); // Quitamos punto de abreviación si existe
      }
    }

    // --- Retorno del objeto mapeado ---
    return {
      ...item,
      id: item.idCita,
      nombres: item.nombres || "Sin Nombre",
      horainicio: item.horaInicio || "00:00",
      servicioNombre: item.especialidad || "General",
      
      // Asignamos la fecha ya procesada
      fecha: fechaFormateada, 

      pagado: item.pagado === true || item.pagado === "true",
      atendido: item.atendido === true || item.atendido === "true",
      
      busquedaRapida: (item.nombres || "").toLowerCase(),
      claseTarjeta: CONFIG_VISUAL_CITADDOS.estilos.tarjeta,
      avatar: CONFIG_VISUAL_CITADDOS.defaultAvatar
    };
  });
};


/**
 * 
 return apiData.map((item) => {
    // --- Lógica de Parseo de Fecha ---
    let fechaFormateada = " / / ";
    
    if (item.fechaSolicitud && item.fechaSolicitud.length === 8) {
      const anio = parseInt(item.fechaSolicitud.substring(0, 4));
      const mes = parseInt(item.fechaSolicitud.substring(4, 6)) - 1; // Mes base 0
      const dia = parseInt(item.fechaSolicitud.substring(6, 8));
      
      const fechaObj = new Date(anio, mes, dia);

      // Validamos que la fecha sea válida antes de formatear
      if (!isNaN(fechaObj.getTime())) {
        fechaFormateada = new Intl.DateTimeFormat('es-PE', { 
          weekday: 'short', 
          day: '2-digit', 
          month: 'short' 
        }).format(fechaObj).replace('.', ''); // Quitamos punto de abreviación si existe
      }
    }

    // --- Retorno del objeto mapeado ---
    return {
      ...item,
      id: item.idCita,
      nombres: item.nombres || "Sin Nombre",
      horainicio: item.horaInicio || "00:00",
      servicioNombre: item.especialidad || "General",
      
      // Asignamos la fecha ya procesada
      fechaLabel: fechaFormateada, 

      pagado: item.pagado === true || item.pagado === "true",
      atendido: item.atendido === true || item.atendido === "true",
      
      busquedaRapida: (item.nombres || "").toLowerCase(),
      claseTarjeta: CONFIG_VISUAL_CITADDOS.estilos.tarjeta,
      avatar: CONFIG_VISUAL_CITADDOS.defaultAvatar
    };
  });
 */


