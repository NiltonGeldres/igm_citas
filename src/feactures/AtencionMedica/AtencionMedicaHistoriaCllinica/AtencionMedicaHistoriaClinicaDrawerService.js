// src/components/HistoriaClinica/AtencionMedicaHistoriaClinicaDrawerService.js
import axios from "axios";
import header from "../../../shared/utils/Header";
import AuthService from "../../../master-data/services/auth.service";

const API_URL = process.env.REACT_APP_URL_API;
const SERVICE_HISTORIA_CLINICA_OBTENER = API_URL + "/api/v1/atenciones/historia-clinica/paciente";

// =========================================================================
// 🚀 CACHÉ EN MEMORIA DEL FRONTEND
// =========================================================================
const cacheHistoriaClinica = new Map();

// =========================================================================
// 🔬 MOCKS DE DESARROLLO (MOCKITO)
// =========================================================================
const MOCK_PATIENT_DATA = {
  idPaciente: 285,
  nombre: 'Cayo Bohorquez Maria Concepcion',
  hc: '21447464',
  edad: '76 años',
  sexo: 'Femenino',
  dni: '10293847',
  grupoSanguineo: 'O+',
  ram: 'Penicilina'
};

const MOCK_ALERTAS_MEDICAS = [
  { tipo: 'RAM', descripcion: 'Alergia a la Penicilina' },
  { tipo: 'ANTECEDENTE', descripcion: 'Hipertensión Arterial' }
];

const MOCK_HISTORIA_CLINICA_PACIENTE = [
  {
    idAtencion: 101,
    fecha: '15/02/2026',
    origenAtencion: 'CONSULTA EXTERNA',
    especialidad: 'Reumatología',
    medico: 'Dr. Roberto Mendoza',
    codigoCie10: 'M15.3',
    diagnostico: 'Artrosis secundaria múltiple',
    anamnesis: 'Paciente refiere dolor persistente en articulaciones interfalángicas bilaterales de 3 meses de evolución.',
    tratamiento: 'Paracetamol 1g c/8h x 10 días + Condroitin sulfato 800mg/día.',
    receta: 'Paracetamol 1g V.O. c/8h\nCondroitin Sulfato 800mg V.O. c/24h',
    signosVitales: {
      pa: '120/80 mmHg',
      fc: '72 bpm',
      temp: '36.5 °C',
      spo2: '98%',
      imc: '23.7'
    }
  },
  {
    idAtencion: 98,
    fecha: '10/11/2025',
    origenAtencion: 'CONSULTA EXTERNA',
    especialidad: 'Medicina Interna',
    medico: 'Dra. Elena Ramos',
    codigoCie10: 'I10',
    diagnostico: 'Hipertensión esencial (primaria)',
    anamnesis: 'Chequeo de rutina. Paciente asintomática, refiere cumplir con tratamiento de presión.',
    tratamiento: 'Continuar con Enalapril 10mg c/12h.',
    receta: 'Enalapril 10mg V.O. c/12h x 30 días',
    signosVitales: {
      pa: '130/85 mmHg',
      fc: '75 bpm',
      temp: '36.6 °C',
      spo2: '97%',
      imc: '23.5'
    }
  }
];

// =========================================================================
// 📦 SERVICIO PRINCIPAL
// =========================================================================

/**
 * Obtiene la historia clínica del paciente por su idPaciente.
 * Utiliza caché en memoria y fallback a mocks en desarrollo.
 */
const obtenerHistoriaClinicaPaciente = async (idPaciente) => {
  if (!idPaciente) return null;

  const idKey = String(idPaciente);

  // ⚡ 1. Verificar Caché en Frontend
  if (cacheHistoriaClinica.has(idKey)) {
    return cacheHistoriaClinica.get(idKey);
  }

  const isProduction = process.env.REACT_APP_NODE_ENV === 'production1';
  let resultado = null;

  if (isProduction) {
    try {
      const response = await axios.get(SERVICE_HISTORIA_CLINICA_OBTENER, {
        params: { idPaciente: idKey },
        headers: header()
      });

      let resultadoJson = response.data;
      if (typeof resultadoJson === 'string') {
        try { resultadoJson = JSON.parse(resultadoJson); } catch (e) {}
      }

      // Estructura esperada de respuesta API
      resultado = {
        patientData: resultadoJson?.patientData || resultadoJson?.paciente || {},
        alertasMedicas: resultadoJson?.alertasMedicas || resultadoJson?.alertas || [],
        historiaClinicaData: Array.isArray(resultadoJson?.data) 
          ? resultadoJson.data 
          : (Array.isArray(resultadoJson) ? resultadoJson : [])
      };

    } catch (error) {
      if (error.response && error.response.status === 403) {
        AuthService.logout();
        window.location.href = "/login";
      }
      console.error(`❌ Error al obtener historia clínica del paciente ${idKey}:`, error);
      return null;
    }
  } else {
    // Modo Desarrollo: Retorna mock en promesa simulada
    resultado = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          patientData: MOCK_PATIENT_DATA,
          alertasMedicas: MOCK_ALERTAS_MEDICAS,
          historiaClinicaData: MOCK_HISTORIA_CLINICA_PACIENTE
        });
      }, 300);
    });
  }

  // ⚡ 2. Guardar en Caché tras respuesta exitosa
  if (resultado) {
    cacheHistoriaClinica.set(idKey, resultado);
  }

  return resultado;
};

// Limpieza manual de caché cuando sea necesario
const limpiarCacheLocal = () => {
  cacheHistoriaClinica.clear();
};

export const AtencionMedicaHistoriaClinicaDrawerService = {
  obtenerHistoriaClinicaPaciente,
  limpiarCacheLocal
};