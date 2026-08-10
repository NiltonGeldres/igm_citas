// src/components/AtencionExamen/AtencionMedicaExamenService.js
import axios from "axios";
import header from "../../../shared/utils/Header";
import { AtencionMedicaExamenMapper } from './AtencionMedicaExamenMapper';

const API_URL = process.env.REACT_APP_URL_API;
const SERVICE_EXAMEN_BUSCAR = `${API_URL}/api/v1/catalogos/servicios/buscar`;

const PAGINACION_DEFAULT = {
  PAGINA_ACTUAL: 1,
  TAMANO_PAGINA: 10,
  ID_ENTIDAD_DEFAULT: 2,
};

// Catálogo de paquetes estructurados que enlazan múltiples exámenes individuales
const MOCK_CATALOGO_PAQUETES = [
  {
    id: 'pkg-01',
    nombrePaquete: 'Preoperatorio Estándar',
    examenesAsociados: [
      { id: '1001', label: 'Hemograma Completo automatizado', codigoExamen: '99211', tipoExamen: '1' },
      { id: '1002', label: 'Examen Completo de Orina (EGO)', codigoExamen: '81000', tipoExamen: '1' },
      { id: '1004', label: 'Electrocardiograma de 12 derivadas (ECG)', codigoExamen: '93000', tipoExamen: '1' },
      { id: '1007', label: 'Glucosa en ayunas en suero o plasma', codigoExamen: '82947', tipoExamen: '1' },
      { id: '1008', label: 'Creatinina en sangre automatizada', codigoExamen: '82565', tipoExamen: '1' }
    ]
  },
  {
    id: 'pkg-02',
    nombrePaquete: 'Perfil Lipídico / Metabólico',
    examenesAsociados: [
      { id: '1006', label: 'Perfil Lipídico (Colesterol, Triglicéridos)', codigoExamen: '80061', tipoExamen: '1' },
      { id: '1007', label: 'Glucosa en ayunas en suero o plasma', codigoExamen: '82947', tipoExamen: '1' }
    ]
  }
];

// =========================================================================
// 🔬 MOCKS DE DESARROLLO
// =========================================================================
const MOCK_CATALOGO_BUSQUEDA = [
  { idProducto: 1001, codigo: "99211", nombre: "Hemograma Completo automatizado", tipoServicio: 1 },
  { idProducto: 1002, codigo: "81000", nombre: "Examen Completo de Orina (EGO)", tipoServicio: 1 },
  { idProducto: 1003, codigo: "71020", nombre: "Radiografía de Tórax (Antero-Posterior)", tipoServicio: 1 },
  { idProducto: 1004, codigo: "93000", nombre: "Electrocardiograma de 12 derivadas (ECG)", tipoServicio: 1 },
  { idProducto: 1005, codigo: "76700", nombre: "Ecografía Abdominal Total completa", tipoServicio: 1 },
  { idProducto: 1006, codigo: "80061", nombre: "Perfil Lipídico (Colesterol, Triglicéridos)", tipoServicio: 1 },
  { idProducto: 1007, codigo: "82947", nombre: "Glucosa en ayunas en suero o plasma", tipoServicio: 1 },
  { idProducto: 1008, codigo: "82565", nombre: "Creatinina en sangre automatizada", tipoServicio: 1 }
];

const MOCK_RESPONSE_NO_ATENDIDO = [];

const MOCK_RESPONSE_ATENDIDO = [
  { idProducto: 1001, nombre: 'Hemograma Completo automatizado', codigo: '99211', tipoServicio: 1, diagnosticosAsociados: [] }
];

// =========================================================================
// 📡 CORE DEL SERVICIO
// =========================================================================
export const AtencionMedicaExamenService = {
  obtenerPaquetesDisponibles: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_CATALOGO_PAQUETES);
      }, 100);
    });
  },

  obtenerExamenesPorPaciente: async (idPaciente, accionAgenda) => {
    console.log("obtenerExamenesPorPaciente:", idPaciente, accionAgenda);
    const isProduction = process.env.REACT_APP_NODE_ENV === 'production';

    if (isProduction) {
      try {
        const response = await axios.get(`${API_URL}/api/atencion-medica/examenes/${idPaciente}`, {
          params: { accion: accionAgenda },
          headers: header()
        });
        return AtencionMedicaExamenMapper.apiToUiRecordList(response.data);
      } catch (error) {
        console.error('❌ Error en producción al obtener exámenes:', error);
        throw error;
      }
    } else {
      return new Promise((resolve) => {
        setTimeout(() => {
          let datosDisparados = accionAgenda === 'ACTUALIZAR' ? MOCK_RESPONSE_ATENDIDO : MOCK_RESPONSE_NO_ATENDIDO;
          resolve(AtencionMedicaExamenMapper.apiToUiRecordList(datosDisparados));
        }, 300);
      });
    }
  },

  buscarExamenesCatalogo: async (query, tipoServicioFiltro = 1, idEntidadFiltro = PAGINACION_DEFAULT.ID_ENTIDAD_DEFAULT) => {
    console.log("Ingreso a buscarExamenesCatalogo");
    const isProduction = process.env.REACT_APP_NODE_ENV === 'production';
    const cleanQuery = (query || '').trim();

    if (!cleanQuery) return [];

    if (isProduction) {
      try {
        const response = await axios.get(SERVICE_EXAMEN_BUSCAR, {
          params: {
            idEntidad: idEntidadFiltro,
            busqueda: cleanQuery,
            tipoServicio: tipoServicioFiltro,
            limite: PAGINACION_DEFAULT.TAMANO_PAGINA,
            pagina: PAGINACION_DEFAULT.PAGINA_ACTUAL
          },
          headers: header()
        });

        const resultadoJson = response.data;
        if (resultadoJson && resultadoJson.estado === 'EXITO' && Array.isArray(resultadoJson.data)) {
          return AtencionMedicaExamenMapper.apiToUiCatalogList(resultadoJson.data);
        }

        return [];
      } catch (error) {
        console.error('❌ Error al buscar exámenes en el catálogo:', error);
        return [];
      }
    } else {
      return new Promise((resolve) => {
        setTimeout(() => {
          const filtrados = MOCK_CATALOGO_BUSQUEDA.filter(item =>
            item.nombre.toLowerCase().includes(cleanQuery.toLowerCase()) ||
            item.codigo.toLowerCase().includes(cleanQuery.toLowerCase())
          );
          resolve(AtencionMedicaExamenMapper.apiToUiCatalogList(filtrados));
        }, 200);
      });
    }
  }
};