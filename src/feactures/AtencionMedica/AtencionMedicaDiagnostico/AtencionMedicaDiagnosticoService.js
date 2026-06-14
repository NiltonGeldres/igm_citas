// src/components/AtencionMedicaDiagnostico/AtencionMedicaDiagnosticoService.js
import { AtencionMedicaDiagnosticoMapper } from './AtencionMedicaDiagnosticoMapper';

// =========================================================================
// 🔬 MOCKS DE DESARROLLO HOMOLOGADOS (Estructura idéntica de API)
// =========================================================================

// Catálogo base con la estructura idéntica que maneja la base de datos / API
const MOCK_CATALOGO_BUSQUEDA = [
  { idDiagnosticoApi: 201, descripcionCie: 'Diabetes Mellitus Tipo 2 sin mención de complicación', codigoAlfa: 'E11.9', clasificacion: '' },
  { idDiagnosticoApi: 202, descripcionCie: 'Hipotiroidismo Primario / No Especificado', codigoAlfa: 'E03.9', clasificacion: '' },
  { idDiagnosticoApi: 203, descripcionCie: 'Hipertiroidismo con Bocio Difuso (Enfermedad de Graves)', codigoAlfa: 'E05.0', clasificacion: '' },
  { idDiagnosticoApi: 204, descripcionCie: 'Obesidad Debida a Exceso de Calorías', codigoAlfa: 'E66.0', clasificacion: '' },
  { idDiagnosticoApi: 205, descripcionCie: 'Hiperlipidemia Mixta', codigoAlfa: 'E78.2', clasificacion: '' },
  { idDiagnosticoApi: 206, descripcionCie: 'Síndrome de Ovario Poliquístico', codigoAlfa: 'E28.2', clasificacion: '' },
  { idDiagnosticoApi: 207, descripcionCie: 'Tiroiditis Autoinmune (Hashimoto)', codigoAlfa: 'E06.3', clasificacion: '' },
  { idDiagnosticoApi: 208, descripcionCie: 'Insuficiencia Adrenocortical Primaria (Enfermedad de Addison)', codigoAlfa: 'E27.1', clasificacion: '' },
  { idDiagnosticoApi: 209, descripcionCie: 'Hiperproactinemia', codigoAlfa: 'E22.1', clasificacion: '' },
  { idDiagnosticoApi: 210, descripcionCie: 'Nódulo Tiroideo Solitario No Tóxico', codigoAlfa: 'E04.1', clasificacion: '' }
];

// Escenario 1: MOCK_RESPONSE_NO_ATENDIDO (Los 3 primeros con su clasificación ya tipificada)
const MOCK_RESPONSE_NO_ATENDIDO = [
  { idDiagnosticoApi: 201, descripcionCie: 'Diabetes Mellitus Tipo 2 sin mención de complicación', codigoAlfa: 'E11.9', clasificacion: 'definitivo' },
  { idDiagnosticoApi: 202, descripcionCie: 'Hipotiroidismo Primario / No Especificado', codigoAlfa: 'E03.9', clasificacion: 'presuntivo' },
  { idDiagnosticoApi: 203, descripcionCie: 'Hipertiroidismo con Bocio Difuso (Enfermedad de Graves)', codigoAlfa: 'E05.0', clasificacion: 'repetitivo' }
];

// Escenario 2: MOCK_RESPONSE_ATENDIDO (Los 5 primeros con su estructura completa)
const MOCK_RESPONSE_ATENDIDO = [
  { idDiagnosticoApi: 201, descripcionCie: 'Diabetes Mellitus Tipo 2 sin mención de complicación', codigoAlfa: 'E11.9', clasificacion: 'definitivo' },
  { idDiagnosticoApi: 202, descripcionCie: 'Hipotiroidismo Primario / No Especificado', codigoAlfa: 'E03.9', clasificacion: 'definitivo' },
  { idDiagnosticoApi: 203, descripcionCie: 'Hipertiroidismo con Bocio Difuso (Enfermedad de Graves)', codigoAlfa: 'E05.0', clasificacion: 'repetitivo' },
  { idDiagnosticoApi: 204, descripcionCie: 'Obesidad Debida a Exceso de Calorías', codigoAlfa: 'E66.0', clasificacion: 'presuntivo' },
  { idDiagnosticoApi: 205, descripcionCie: 'Hiperlipidemia Mixta', codigoAlfa: 'E78.2', clasificacion: 'definitivo' }
];

// Escenario 3: MOCK_RESPONSE_BUSQUEDA (Estructura idéntica para modo lectura)
const MOCK_RESPONSE_BUSQUEDA = [
  { idDiagnosticoApi: 201, descripcionCie: 'Diabetes Mellitus Tipo 2 sin mención de complicación', codigoAlfa: 'E11.9', clasificacion: 'repetitivo' }
];

// =========================================================================
// 📡 CORE DEL SERVICIO
// =========================================================================
export const AtencionMedicaDiagnosticoService = {

  /**
   * Obtiene los diagnósticos actuales de la atención del paciente.
   */
  obtenerDiagnosticosPorPaciente: async (idPaciente, accionAgenda) => {
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
      try {
        const response = await fetch(`/api/atencion-medica/diagnosticos/${idPaciente}?accion=${accionAgenda}`);
        if (!response.ok) throw new Error('Error al recuperar diagnósticos del servidor');
        const data = await response.json();
        return AtencionMedicaDiagnosticoMapper.apiToUiRecordList(data);
      } catch (error) {
        console.error('❌ Error en producción al obtener diagnósticos:', error);
        throw error;
      }
    } else {
      return new Promise((resolve) => {
        setTimeout(() => {
          let datosDisparados;

          switch (accionAgenda) {
            case 'ATENDER':
              datosDisparados = MOCK_RESPONSE_NO_ATENDIDO;
              break;
            case 'ACTUALIZAR':
              datosDisparados = MOCK_RESPONSE_ATENDIDO;
              break;
            case 'BUSQUEDA':
            default:
              datosDisparados = MOCK_RESPONSE_BUSQUEDA;
              break;
          }

          console.log(`📋 [MockService] Homologado disparado para: ${accionAgenda}`);
          resolve(AtencionMedicaDiagnosticoMapper.apiToUiRecordList(datosDisparados));
        }, 300);
      });
    }
  },

  /**
   * Filtra el catálogo de la especialidad para el Autocomplete.
   */
  buscarDiagnosticosCatalogo: async (query) => {
    const isProduction = process.env.NODE_ENV === 'production';
    const cleanQuery = (query || '').trim().toLowerCase();

    if (isProduction) {
      try {
        const response = await fetch(`/api/atencion-medica/catalogo/cie10?search=${encodeURIComponent(cleanQuery)}`);
        if (!response.ok) throw new Error('Error al consultar catálogo de producción');
        const data = await response.json();
        return AtencionMedicaDiagnosticoMapper.apiToUiCatalogList(data);
      } catch (error) {
        console.error('❌ Error en catálogo de producción:', error);
        throw error;
      }
    } else {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (!cleanQuery) return resolve([]);

          const filtrados = MOCK_CATALOGO_BUSQUEDA.filter(item =>
            item.descripcionCie.toLowerCase().includes(cleanQuery) ||
            item.codigoAlfa.toLowerCase().includes(cleanQuery)
          );
          resolve(AtencionMedicaDiagnosticoMapper.apiToUiCatalogList(filtrados));
        }, 200);
      });
    }
  }
};