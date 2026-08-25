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

