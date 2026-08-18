// src/components/AtencionExamen/AtencionMedicaExamenService.js
import axios from "axios";
import header from "../../../shared/utils/Header";
import { AtencionMedicaExamenMapper } from './AtencionMedicaExamenMapper';
import AuthService from "../../../master-data/services/auth.service";

const API_URL = process.env.REACT_APP_URL_API;
const SERVICE_SERVICIOS_BUSCAR = API_URL + "/api/v1/catalogos/servicios/buscar";
const SERVICE_PAQUETE_DETALLE = API_URL + "/api/v1/catalogos/servicios/paquete/detalle";

const PAGINACION_DEFAULT = {
  PAGINA_ACTUAL: 1,
  TAMANO_PAGINA: 30,
  TIPO_SERVICIO: 1, // 1: Laboratorio / Procedimientos / Exámenes
  ID_ENTIDAD_DEFAULT: 0
};

// =========================================================================
// 🚀 CACHÉ EN MEMORIA DEL FRONTEND
// =========================================================================
const cacheBusquedaIndividual = new Map();
const cacheDetallePaquetes = new Map();

// =========================================================================
// 🔬 MOCKS DE DESARROLLO
// =========================================================================

const MOCK_LISTA_PAQUETES = [
  { idPaqueteExamen: 'pkg-ex-01', nombrePaquete: 'Perfil Hepático Completo Mockito' },
  { idPaqueteExamen: 'pkg-ex-02', nombrePaquete: 'Riesgo Quirúrgico Estándar Mockito' }
];

const MOCK_DETALLE_PAQUETE_RESPONSE = {
  'pkg-ex-01': [
    { idProducto: 5001, nombre: 'PERFIL HEPATICO (TGO, TGP, BILIRRUBINAS)', codigo: '80076', tipoServicio: 1 },
    { idProducto: 5002, nombre: 'TIEMPO DE PROTROMBINA (TP)', codigo: '85610', tipoServicio: 1 }
  ],
  'pkg-ex-02': [
    { idProducto: 50013, nombre: 'HEMOGLOBINA HEMATOCRITO', codigo: '85018', tipoServicio: 1 },
    { idProducto: 50014, nombre: 'ELECTROCARDIOGRAMA (EKG)', codigo: '93000', tipoServicio: 1 }
  ]
};

const MOCK_CATALOGO_BUSQUEDA = [
  { idProducto: 50013, codigo: "85018", nombre: "HEMOGLOBINA HEMATOCRITO", tipoServicio: 1 },
  { idProducto: 50014, codigo: "80053", nombre: "PERFIL METABOLICO COMPLETO", tipoServicio: 1 },
  { idProducto: 50015, codigo: "81000", nombre: "EXAMEN COMPLETO DE ORINA", tipoServicio: 1 }
];

// =========================================================================
// ⚙️ FUNCIONES AUXILIARES
// =========================================================================

const obtenerCatalogoPaquetesDesdeCache = () => {
  try {
    const stored = sessionStorage.getItem('catalogo_global');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.catalogoPaquetesExamenes || parsed?.catalogoPaquetesServicios || parsed?.paquetes || [];
    }
  } catch (e) {
    console.warn("⚠️ No se pudo leer el catálogo global desde sessionStorage:", e);
  }
  return [];
};

// =========================================================================
// 📦 PROCESO 1: PAQUETES DE EXÁMENES / SERVICIOS (CON CACHÉ)
// =========================================================================

const obtenerListaPaquetes = async () => {
  const isProduction = process.env.REACT_APP_NODE_ENV === 'production';

  if (!isProduction) {
    return AtencionMedicaExamenMapper.apiToUiPackageList(MOCK_LISTA_PAQUETES);
  }

  const paquetesCache = obtenerCatalogoPaquetesDesdeCache();
  return AtencionMedicaExamenMapper.apiToUiPackageList(paquetesCache);
};

const obtenerProductosPorPaquete = async (idPaquete) => {
  if (!idPaquete) return [];

  const idKey = String(idPaquete);

  if (cacheDetallePaquetes.has(idKey)) {
    return cacheDetallePaquetes.get(idKey);
  }

  const isProduction = process.env.REACT_APP_NODE_ENV === 'production';
  let resultado = [];

  if (!isProduction) {
    const productosRaw = MOCK_DETALLE_PAQUETE_RESPONSE[idKey] || [];
    resultado = AtencionMedicaExamenMapper.apiToUiCatalogList(productosRaw);
  } else {
    try {
      const response = await axios.get(SERVICE_PAQUETE_DETALLE, {
        params: { idPaquete: idKey, tipoServicio: PAGINACION_DEFAULT.TIPO_SERVICIO },
        headers: header()
      });

      let resultadoJson = response.data;
      if (typeof resultadoJson === 'string') {
        try { resultadoJson = JSON.parse(resultadoJson); } catch (e) {}
      }

      const listaProductos = Array.isArray(resultadoJson) 
        ? resultadoJson 
        : (resultadoJson?.data || resultadoJson?.items || []);

      resultado = AtencionMedicaExamenMapper.apiToUiCatalogList(listaProductos);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        AuthService.logout();
        window.location.href = "/login";
      }
      console.error(`❌ Error al obtener detalle del paquete de exámenes ${idKey}:`, error);
      return [];
    }
  }

  cacheDetallePaquetes.set(idKey, resultado);
  return resultado;
};

// =========================================================================
// 🔍 PROCESO 2: BÚSQUEDA POR NOMBRE / CÓDIGO (CON CACHÉ)
// =========================================================================

const buscarExamenesCatalogo = async (query) => {
  const isProduction = process.env.REACT_APP_NODE_ENV === 'production';
  const cleanQuery = (query || '').trim();

  if (!cleanQuery) return [];

  const cacheKey = `0_${cleanQuery.toLowerCase()}`;

  if (cacheBusquedaIndividual.has(cacheKey)) {
    return cacheBusquedaIndividual.get(cacheKey);
  }

  let resultado = [];

  if (isProduction) {
    try {
      const params = {
        idEntidad: 0,
        busqueda: cleanQuery,
        tipoServicio: PAGINACION_DEFAULT.TIPO_SERVICIO,
        tamanoPagina: PAGINACION_DEFAULT.TAMANO_PAGINA,
        paginaActual: PAGINACION_DEFAULT.PAGINA_ACTUAL,
      };

      const response = await axios.get(SERVICE_SERVICIOS_BUSCAR, {
        params,
        headers: header()
      });

      let resultadoJson = response.data;
      if (typeof resultadoJson === 'string') {
        try { resultadoJson = JSON.parse(resultadoJson); } catch (e) {}
      }

      if (resultadoJson && resultadoJson.estado === 'EXITO' && Array.isArray(resultadoJson.data)) {
        resultado = AtencionMedicaExamenMapper.apiToUiCatalogList(resultadoJson.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        AuthService.logout();
        window.location.href = "/login";
      }
      console.error("❌ Error al buscar exámenes en el catálogo (Producción):", error);
      return [];
    }
  } else {
    resultado = await new Promise((resolve) => {
      setTimeout(() => {
        const filtrados = MOCK_CATALOGO_BUSQUEDA.filter(item =>
          item.nombre.toLowerCase().includes(cleanQuery.toLowerCase()) ||
          item.codigo.toLowerCase().includes(cleanQuery.toLowerCase())
        );
        resolve(AtencionMedicaExamenMapper.apiToUiCatalogList(filtrados));
      }, 200);
    });
  }

  cacheBusquedaIndividual.set(cacheKey, resultado);

  return resultado;
};

const limpiarCacheLocal = () => {
  cacheBusquedaIndividual.clear();
  cacheDetallePaquetes.clear();
};

export const AtencionMedicaExamenService = {
  obtenerListaPaquetes,
  obtenerProductosPorPaquete,
  buscarExamenesCatalogo,
  limpiarCacheLocal
};

/*
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

    console.log("Ingreso a buscarExamenesCatalogo"+JSON.stringify(query));
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
    console.log("Ingreso a buscarExamenesCatalogo" +JSON.stringify(response.data));
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
*/