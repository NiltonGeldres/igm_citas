// src/components/HistoriaClinica/AtencionMedicaHistoriaClinicaDrawerService.js
import axios from "axios";
import header from "../../../shared/utils/Header";
import AuthService from "../../../master-data/services/auth.service";

const API_URL = process.env.REACT_APP_URL_API;

// Endpoint base según controlador Spring Boot: @GetMapping("/paciente/{idPaciente}/panel-historia")
const SERVICE_HISTORIA_CLINICA_OBTENER = `${API_URL}/api/v1/atenciones-medicas/paciente`;

// =========================================================================
// 🚀 CACHÉ EN MEMORIA DEL FRONTEND
// =========================================================================
const cacheHistoriaClinica = new Map();

// =========================================================================
// 🛠️ PARSER DE RESPUESTA BACKEND
// =========================================================================

/**
 * Parsea y estandariza el JSON recibido del backend.
 * Soporta tanto objetos JSON procesados como respuestas en String JSON.
 */
const formatearRespuestaBackend = (rawJson) => {
  if (!rawJson) return null;

  let json = rawJson;
  if (typeof rawJson === 'string') {
    try {
      json = JSON.parse(rawJson);
    } catch (e) {
      console.error("Error al parsear el JSON de Historia Clínica:", e);
      return null;
    }
  }

  const atenciones = Array.isArray(json?.atenciones) ? json.atenciones : [];
  const especialidades = Array.isArray(json?.especialidades) ? json.especialidades : [];

  // 1. Extraer datos del paciente priorizando la raíz o el primer episodio médico
  const pacienteBase = json?.paciente || atenciones[0]?.paciente || {};

  // 2. Extraer o derivar alertas médicas (RAM / Alergias / Antecedentes críticos)
  const alertasMedicas = Array.isArray(json?.alertasMedicas) 
    ? json.alertasMedicas 
    : (pacienteBase.ram ? [{ tipo: 'RAM', descripcion: pacienteBase.ram }] : []);

  return {
    patientData: {
      idPaciente: json?.idPaciente || atenciones[0]?.idPaciente || null,
      nombre: pacienteBase.name || pacienteBase.nombre || 'S/N',
      hc: pacienteBase.hc || 'S/N',
      edad: pacienteBase.edad ? `${pacienteBase.edad} Años` : 'S/E',
      sexo: pacienteBase.sexo || 'S/S'
    },
    alertasMedicas: alertasMedicas,
    especialidades: especialidades,
    atenciones: atenciones,
    // Propiedad de retrocompatibilidad con vistas anteriores en tu Hook
    historiaClinicaData: atenciones
  };
};

// =========================================================================
// 📦 SERVICIO PRINCIPAL
// =========================================================================

/**
 * Obtiene el panel de historia clínica del paciente por su idPaciente.
 * Maneja caché local en memoria e intercepta errores de sesión.
 */
const obtenerHistoriaClinicaPaciente = async (idPaciente) => {
  console.log("ID PACIENTE    "+idPaciente)
  if (!idPaciente) return null;

  const idKey = String(idPaciente);

  // ⚡ 1. Verificar Caché en Frontend
  if (cacheHistoriaClinica.has(idKey)) {
    return cacheHistoriaClinica.get(idKey);
  }

  try {
    // GET /api/v1/atenciones/paciente/{idPaciente}/panel-historia
    const urlEndpoint = `${SERVICE_HISTORIA_CLINICA_OBTENER}/${idKey}/panel-historia`;
    console.log("urlEndpoint   "+urlEndpoint)

    const response = await axios.get(urlEndpoint, {
      headers: header()
    });

    console.log("HISTORIA   "+JSON.stringify(response))
    const resultado = formatearRespuestaBackend(response.data);

    // ⚡ 2. Guardar en Caché tras respuesta exitosa
    if (resultado) {
      cacheHistoriaClinica.set(idKey, resultado);
    }

    return resultado;

  } catch (error) {
    if (error.response && error.response.status === 403) {
      AuthService.logout();
      window.location.href = "/login";
    }
    console.error(`❌ Error al obtener historia clínica del paciente ${idKey}:`, error);
    return null;
  }
};

/**
 * Limpia la caché local en memoria.
 * Útil para forzar una recarga tras registrar una nueva atención médica.
 */
const limpiarCacheLocal = () => {
  cacheHistoriaClinica.clear();
};

export const AtencionMedicaHistoriaClinicaDrawerService = {
  obtenerHistoriaClinicaPaciente,
  limpiarCacheLocal
};