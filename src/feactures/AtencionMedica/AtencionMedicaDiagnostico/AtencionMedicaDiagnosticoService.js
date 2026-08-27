import axios from "axios";
import header from "../../../shared/utils/Header";
import { AtencionMedicaDiagnosticoMapper } from './AtencionMedicaDiagnosticoMapper';

const API_URL = process.env.REACT_APP_URL_API;
const SERVICE_DIAGNOSTICO_BUSCAR = `${API_URL}/api/v1/catalogos/diagnosticos/buscar`;

const PAGINACION_DEFAULT = {
  PAGINA_ACTUAL: 1,
  TAMANO_PAGINA: 10,
};

export const AtencionMedicaDiagnosticoService = {

  // Carga inicial/vacía
  obtenerDiagnosticosIniciales: () => [],

  // Carga desde respuesta de la API
  obtenerDiagnosticosRegistrados: (dataAtencionRegistrada) => {
    return AtencionMedicaDiagnosticoMapper.apiToUiRecordList(dataAtencionRegistrada);
  },

  // Búsqueda en catálogo autocomplete
  buscarDiagnosticosCatalogo: async (query) => {
    const cleanQuery = (query || '').trim();
    if (!cleanQuery) return [];

    try {
      const response = await axios.get(SERVICE_DIAGNOSTICO_BUSCAR, {
        params: {
          busqueda: cleanQuery,
          limite: PAGINACION_DEFAULT.TAMANO_PAGINA,
          pagina: PAGINACION_DEFAULT.PAGINA_ACTUAL
        },
        headers: header()
      });

      const resultadoJson = response.data;
      if (resultadoJson && resultadoJson.estado === 'EXITO' && Array.isArray(resultadoJson.data)) {
        return AtencionMedicaDiagnosticoMapper.apiToUiCatalogList(resultadoJson.data);
      }

      return [];
    } catch (error) {
      console.error('❌ Error al buscar diagnósticos en el catálogo:', error);
      return [];
    }
  },

  // Preparación de payload para envío
  prepararParaGuardar: (panelDiagnosticos) => {
    return AtencionMedicaDiagnosticoMapper.uiToApiDiagnosticos(panelDiagnosticos);
  }
};

/*
// src/components/AtencionMedicaDiagnostico/AtencionMedicaDiagnosticoService.js
import axios from "axios";
import header from "../../../shared/utils/Header";
import { AtencionMedicaDiagnosticoMapper } from './AtencionMedicaDiagnosticoMapper';

const API_URL = process.env.REACT_APP_URL_API;
const SERVICE_DIAGNOSTICO_BUSCAR = `${API_URL}/api/v1/catalogos/diagnosticos/buscar`;

const PAGINACION_DEFAULT = {
  PAGINA_ACTUAL: 1,
  TAMANO_PAGINA: 10,
};

// =========================================================================
// 🔬 MOCKS DE DESARROLLO (Alineados al JSON real de la API)
// =========================================================================
const MOCK_CATALOGO_BUSQUEDA = [
  { idDiagnostico: 47, codigoCie: 'A07.0', descripcion: 'Balantidiasis' },
  { idDiagnostico: 48, codigoCie: 'A07.1', descripcion: 'Giardiasis [lambliasis]' },
  { idDiagnostico: 59, codigoCie: 'A09.X', descripcion: 'Diarrea y gastroenteritis de presunto origen infeccioso' },
  { idDiagnostico: 179, codigoCie: 'A39.5', descripcion: 'Enfermedad cardiaca debida a meningococo' },
  { idDiagnostico: 201, codigoCie: 'E11.9', descripcion: 'Diabetes Mellitus Tipo 2 sin mención de complicación' }
];

const MOCK_RESPONSE_NO_ATENDIDO = [];

const MOCK_RESPONSE_ATENDIDO = [
  { idDiagnosticoApi: 201, descripcionCie: 'Diabetes Mellitus Tipo 2 sin mención de complicación', codigoAlfa: 'E11.9', clasificacion: 'definitivo' }
];

// =========================================================================
// 📡 CORE DEL SERVICIO
// =========================================================================
export const AtencionMedicaDiagnosticoService = {

  obtenerDiagnosticosPorPaciente: async (idPaciente, accionAgenda) => {
    console.log("obtenerDiagnosticosPorPaciente:", idPaciente, accionAgenda);
    const isProduction = process.env.REACT_APP_NODE_ENV === 'production';

    if (isProduction) {
      try {
        const response = await axios.get(`${API_URL}/api/atencion-medica/diagnosticos/${idPaciente}`, {
          params: { accion: accionAgenda },
          headers: header()
        });
        return AtencionMedicaDiagnosticoMapper.apiToUiRecordList(response.data);
      } catch (error) {
        console.error('❌ Error en producción al obtener diagnósticos:', error);
        throw error;
      }
    } else {
      return new Promise((resolve) => {
        setTimeout(() => {
          let datosDisparados = accionAgenda === 'ACTUALIZAR' ? MOCK_RESPONSE_ATENDIDO : MOCK_RESPONSE_NO_ATENDIDO;
          resolve(AtencionMedicaDiagnosticoMapper.apiToUiRecordList(datosDisparados));
        }, 300);
      });
    }
  },

  buscarDiagnosticosCatalogo: async (query) => {
    console.log("Ingreso a buscarDiagnosticosCatalogo");
    const isProduction = process.env.REACT_APP_NODE_ENV === 'production';
    const cleanQuery = (query || '').trim();

    if (!cleanQuery) return [];

    if (isProduction) {
      try {
        const response = await axios.get(SERVICE_DIAGNOSTICO_BUSCAR, {
          params: {
            busqueda: cleanQuery,
            limite: PAGINACION_DEFAULT.TAMANO_PAGINA,
            pagina: PAGINACION_DEFAULT.PAGINA_ACTUAL
          },
          headers: header()
        });

        const resultadoJson = response.data;
        if (resultadoJson && resultadoJson.estado === 'EXITO' && Array.isArray(resultadoJson.data)) {
          return AtencionMedicaDiagnosticoMapper.apiToUiCatalogList(resultadoJson.data);
        }

        return [];
      } catch (error) {
        console.error('❌ Error al buscar diagnósticos en el catálogo:', error);
        return [];
      }
    } else {
      return new Promise((resolve) => {
        setTimeout(() => {
          const filtrados = MOCK_CATALOGO_BUSQUEDA.filter(item =>
            item.descripcion.toLowerCase().includes(cleanQuery.toLowerCase()) ||
            item.codigoCie.toLowerCase().includes(cleanQuery.toLowerCase())
          );
          resolve(AtencionMedicaDiagnosticoMapper.apiToUiCatalogList(filtrados));
        }, 200);
      });
    }
  }
};
*/