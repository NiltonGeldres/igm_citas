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
  TIPO_SERVICIO: 1
};

const cacheBusquedaIndividual = new Map();
const cacheDetallePaquetes = new Map();

// Mocks locales
const MOCK_LISTA_PAQUETES = [
  { idPaqueteExamen: 'pkg-ex-01', nombrePaquete: 'Perfil Hepático Completo' },
  { idPaqueteExamen: 'pkg-ex-02', nombrePaquete: 'Riesgo Quirúrgico Estándar' }
];

const MOCK_DETALLE_PAQUETE_RESPONSE = {
  'pkg-ex-01': [
    { idProducto: 5001, nombreProducto: 'PERFIL HEPATICO (TGO, TGP, BILIRRUBINAS)', codigo: '80076', idPuntoCarga: 1 },
    { idProducto: 5002, nombreProducto: 'TIEMPO DE PROTROMBINA (TP)', codigo: '85610', idPuntoCarga: 1 }
  ],
  'pkg-ex-02': [
    { idProducto: 50013, nombreProducto: 'HEMOGLOBINA HEMATOCRITO', codigo: '85018', idPuntoCarga: 1 },
    { idProducto: 50014, nombreProducto: 'ELECTROCARDIOGRAMA (EKG)', codigo: '93000', idPuntoCarga: 1 }
  ]
};

const MOCK_CATALOGO_BUSQUEDA = [
  { idProducto: 1, codigo: "43235", nombreProducto: "Anestesia para procedimientos de las glándulas salivales", idPuntoCarga: 1 },
  { idProducto: 50013, codigo: "85018", nombreProducto: "HEMOGLOBINA HEMATOCRITO", idPuntoCarga: 1 },
  { idProducto: 50014, codigo: "80053", nombreProducto: "PERFIL METABOLICO COMPLETO", idPuntoCarga: 1 },
  { idProducto: 50015, codigo: "81000", nombreProducto: "EXAMEN COMPLETO DE ORINA", idPuntoCarga: 1 }
];

export const AtencionMedicaExamenService = {
  /**
   * Retorna el estado inicial vacío para nueva atención.
   */
  obtenerExamenesIniciales: () => {
    return [];
  },

  /**
   * Mapea los exámenes desde el objeto dataAtencion retornado por la API.
   */
  obtenerExamenesRegistrados: (dataAtencion = {}, listaDiagnosticos = []) => {
    if (!dataAtencion || !Array.isArray(dataAtencion.examenesAuxiliares)) {
      return [];
    }
    return AtencionMedicaExamenMapper.apiToUiExamenes(dataAtencion.examenesAuxiliares, listaDiagnosticos);
  },

  obtenerListaPaquetes: async () => {
    const isProduction = process.env.REACT_APP_NODE_ENV === 'production';
    if (!isProduction) {
      return AtencionMedicaExamenMapper.apiToUiPackageList(MOCK_LISTA_PAQUETES);
    }
    try {
      const stored = sessionStorage.getItem('catalogo_global');
      if (stored) {
        const parsed = JSON.parse(stored);
        const pkgs = parsed?.catalogoPaquetesExamenes || parsed?.catalogoPaquetesServicios || parsed?.paquetes || [];
        return AtencionMedicaExamenMapper.apiToUiPackageList(pkgs);
      }
    } catch (e) {
      console.warn("⚠️ Error leyendo catalogo_global:", e);
    }
    return [];
  },

  obtenerProductosPorPaquete: async (idPaquete) => {
    if (!idPaquete) return [];
    const idKey = String(idPaquete);

    if (cacheDetallePaquetes.has(idKey)) return cacheDetallePaquetes.get(idKey);

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
        let resultadoJson = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        const lista = Array.isArray(resultadoJson) ? resultadoJson : (resultadoJson?.data || []);
        resultado = AtencionMedicaExamenMapper.apiToUiCatalogList(lista);
      } catch (error) {
        if (error.response?.status === 403) {
          AuthService.logout();
          window.location.href = "/login";
        }
        console.error(`❌ Error al obtener paquete de exámenes ${idKey}:`, error);
        return [];
      }
    }

    cacheDetallePaquetes.set(idKey, resultado);
    return resultado;
  },

  buscarExamenesCatalogo: async (query) => {
    const isProduction = process.env.REACT_APP_NODE_ENV === 'production';
    const cleanQuery = (query || '').trim();
    if (!cleanQuery) return [];

    const cacheKey = `0_${cleanQuery.toLowerCase()}`;
    if (cacheBusquedaIndividual.has(cacheKey)) return cacheBusquedaIndividual.get(cacheKey);

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

        const response = await axios.get(SERVICE_SERVICIOS_BUSCAR, { params, headers: header() });
        let resultadoJson = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        if (resultadoJson && resultadoJson.estado === 'EXITO' && Array.isArray(resultadoJson.data)) {
          resultado = AtencionMedicaExamenMapper.apiToUiCatalogList(resultadoJson.data);
        }
      } catch (error) {
        if (error.response?.status === 403) {
          AuthService.logout();
          window.location.href = "/login";
        }
        console.error("❌ Error al buscar exámenes:", error);
        return [];
      }
    } else {
      resultado = await new Promise((resolve) => {
        setTimeout(() => {
          const filtrados = MOCK_CATALOGO_BUSQUEDA.filter(item =>
            item.nombreProducto.toLowerCase().includes(cleanQuery.toLowerCase()) ||
            item.codigo.toLowerCase().includes(cleanQuery.toLowerCase())
          );
          resolve(AtencionMedicaExamenMapper.apiToUiCatalogList(filtrados));
        }, 200);
      });
    }

    cacheBusquedaIndividual.set(cacheKey, resultado);
    return resultado;
  },

  limpiarCacheLocal: () => {
    cacheBusquedaIndividual.clear();
    cacheDetallePaquetes.clear();
  }
};