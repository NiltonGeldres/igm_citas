// src/components/Medicacion/AtencionMedicaMedicamentoService.js

const MOCK_CATALOGO_MEDICAMENTOS = [
  { id: 'med1', label: 'Paracetamol 500mg' },
  { id: 'med2', label: 'Ibuprofeno 400mg' },
  { id: 'med3', label: 'Amoxicilina 500mg' },
  { id: 'med4', label: 'Omeprazol 20mg' },
  { id: 'med5', label: 'Loratadina 10mg' },
  { id: 'med6', label: 'Atorvastatina 20mg' },
  { id: 'med7', label: 'Metformina 850mg' },
  { id: 'med8', label: 'Salbutamol 100mcg/dosis Inhalador' }
];

const MOCK_CATALOGO_PAQUETES_MEDICACION = [
  {
    id: 'pkg-med-01',
    nombrePaquete: 'Esquema Erradicación H. Pylori',
    medicamentosAsociados: [
      { id: 'med-p1', descripcion: 'Omeprazol 20mg', dosis: '20.0', frecuencia: 2, periodo: 14, cantidad: 28, via: 'Oral' },
      { id: 'med-p2', descripcion: 'Amoxicilina 500mg', dosis: '1000.0', frecuencia: 2, periodo: 14, cantidad: 56, via: 'Oral' },
      { id: 'med-p3', descripcion: 'Ciprofloxacino 500mg', dosis: '500.0', frecuencia: 2, periodo: 14, cantidad: 28, via: 'Oral' }
    ]
  },
  {
    id: 'pkg-med-02',
    nombrePaquete: 'Sintomático Respiratorio Adulto',
    medicamentosAsociados: [
      { id: 'med-s1', descripcion: 'Paracetamol 500mg', dosis: '500.0', frecuencia: 3, periodo: 3, cantidad: 9, via: 'Oral' },
      { id: 'med-s2', descripcion: 'Loratadina 10mg', dosis: '10.0', frecuencia: 1, periodo: 5, cantidad: 5, via: 'Oral' }
    ]
  }
];

export const AtencionMedicaMedicamentoService = {
  buscarMedicamentosCatalogo: async (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!query) return resolve([]);
        const filtered = MOCK_CATALOGO_MEDICAMENTOS.filter(med =>
          med.label.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, 150);
    });
  },

  obtenerPaquetesDisponibles: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_CATALOGO_PAQUETES_MEDICACION);
      }, 100);
    });
  }
};