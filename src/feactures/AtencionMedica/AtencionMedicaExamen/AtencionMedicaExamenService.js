// src/components/AtencionExamen/AtencionMedicaExamenService.js
import { AtencionMedicaExamenMapper } from './AtencionMedicaExamenMapper';

// 🏢 MOCKS DE CATÁLOGOS ENCAPSULADOS INTERNAMENTE
const MOCK_CATALOGO_BUSQUEDA_EXAMENES = [
  { id: '1001', label: 'Hemograma Completo automatizado', codigoProcedimiento: '99211', tipoExamen: 'Laboratorio' },
  { id: '1002', label: 'Examen Completo de Orina (EGO)', codigoProcedimiento: '81000', tipoExamen: 'Laboratorio' },
  { id: '1003', label: 'Radiografía de Tórax (Antero-Posterior)', codigoProcedimiento: '71020', tipoExamen: 'Imagenología' },
  { id: '1004', label: 'Electrocardiograma de 12 derivadas (ECG)', codigoProcedimiento: '93000', tipoExamen: 'Cardiología' },
  { id: '1005', label: 'Ecografía Abdominal Total completa', codigoProcedimiento: '76700', tipoExamen: 'Imagenología' },
  { id: '1006', label: 'Perfil Lipídico (Colesterol, Triglicéridos)', codigoProcedimiento: '80061', tipoExamen: 'Laboratorio' },
  { id: '1007', label: 'Glucosa en ayunas en suero o plasma', codigoProcedimiento: '82947', tipoExamen: 'Laboratorio' },
  { id: '1008', label: 'Creatinina en sangre automatizada', codigoProcedimiento: '82565', tipoExamen: 'Laboratorio' }
];

// Catálogo de paquetes estructurados que enlazan múltiples exámenes individuales
const MOCK_CATALOGO_PAQUETES = [
  {
    id: 'pkg-01',
    nombrePaquete: 'Preoperatorio Estándar',
    examenesAsociados: [
      { id: '1001', label: 'Hemograma Completo automatizado', codigoProcedimiento: '99211', tipoExamen: 'Laboratorio' },
      { id: '1002', label: 'Examen Completo de Orina (EGO)', codigoProcedimiento: '81000', tipoExamen: 'Laboratorio' },
      { id: '1004', label: 'Electrocardiograma de 12 derivadas (ECG)', codigoProcedimiento: '93000', tipoExamen: 'Cardiología' },
      { id: '1007', label: 'Glucosa en ayunas en suero o plasma', codigoProcedimiento: '82947', tipoExamen: 'Laboratorio' },
      { id: '1008', label: 'Creatinina en sangre automatizada', codigoProcedimiento: '82565', tipoExamen: 'Laboratorio' }
    ]
  },
  {
    id: 'pkg-02',
    nombrePaquete: 'Perfil Lipídico / Metabólico',
    examenesAsociados: [
      { id: '1006', label: 'Perfil Lipídico (Colesterol, Triglicéridos)', codigoProcedimiento: '80061', tipoExamen: 'Laboratorio' },
      { id: '1007', label: 'Glucosa en ayunas en suero o plasma', codigoProcedimiento: '82947', tipoExamen: 'Laboratorio' }
    ]
  }
];

const MOCK_RESPONSE_EXAMENES_NO_ATENDIDO = [];
const MOCK_RESPONSE_EXAMENES_ATENDIDO = [];

export const AtencionMedicaExamenService = {
  /**
   * Busca exámenes individuales en el catálogo general.
   */
  buscarExamenesCatalogo: async (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!query) return resolve([]);
        const filtered = MOCK_CATALOGO_BUSQUEDA_EXAMENES.filter(exam =>
          exam.label.toLowerCase().includes(query.toLowerCase()) ||
          exam.codigoProcedimiento.includes(query)
        );
        resolve(filtered);
      }, 150);
    });
  },

  /**
   * Obtiene la lista de paquetes disponibles para cargar en bloque.
   */
  obtenerPaquetesDisponibles: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_CATALOGO_PAQUETES);
      }, 100);
    });
  },

  /**
   * Recupera el plan de trabajo persistido previamente para el paciente.
   */
  obtenerExamenesPorPaciente: async (idPaciente, accionAgenda) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockRaw = (accionAgenda === 'ACTUALIZAR') 
          ? MOCK_RESPONSE_EXAMENES_ATENDIDO 
          : MOCK_RESPONSE_EXAMENES_NO_ATENDIDO;
          
        resolve(AtencionMedicaExamenMapper.apiToLocal(mockRaw));
      }, 200);
    });
  }
};