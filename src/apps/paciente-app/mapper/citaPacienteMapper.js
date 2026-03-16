import { User, ShieldCheck } from 'lucide-react';

const CONFIG_VISUAL_CITADDOS = {
  defaultAvatar: <User size={40} className="text-slate-400" />,
  badgeVerificado: <ShieldCheck size={16} className="text-blue-500" />,
  estilos: {
    tarjeta: "border rounded-xl p-3 hover:shadow-md transition-all cursor-pointer",
    monto: "text-success fw-bold fs-5"
  }
};

export const mapearCitaPacienteRequest = (idMedico, fechaUI) => {
  return {
    idMedico: idMedico,
    // Convertimos "2026-03-13" (HTML5) a "20260313" (El Request de Java)
    fecha: fechaUI ? fechaUI.replace(/-/g, '') : ''
  };
};

export const transformarCitas = (apiData) => {
  if (!Array.isArray(apiData)) return [];

  return apiData.map((item) => ({
    // 1. Mantener originales por si acaso
    ...item,

    // 2. Mapeo exacto para el Front
    id: item.idCita,
    nombres: item.nombres || "Sin Nombre",
    horainicio: item.horaInicio || "00:00",
    servicioNombre: item.especialidad || "General",
    
    // 3. Normalización de Booleanos (Maneja "true", true, null)
    pagado: item.pagado === true || item.pagado === "true",
    atendido: item.estadoCita === true || item.estadoCita === "true",
    
    busquedaRapida: (item.nombres || "").toLowerCase(),
    
    // 5. UI Props
    claseTarjeta: CONFIG_VISUAL_CITADDOS.estilos.tarjeta,
    avatar: CONFIG_VISUAL_CITADDOS.defaultAvatar
  }));
};

