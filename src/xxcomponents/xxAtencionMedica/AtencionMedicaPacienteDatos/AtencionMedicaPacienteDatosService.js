// src/components/AtencionMedica/AtencionMedicaPacienteDatos/PatientService.js

/**
 * Servicio para manejar las operaciones relacionadas con los pacientes.
 * Simula llamadas a una API backend.
 * Este servicio ha sido movido a la carpeta de sus componentes relacionados
 * para una mejor organización por característica.
 */
const AtencionMedicaPacienteDatosService = {

  /**
   * Simula la obtención de una lista de pacientes citados desde el backend.
   * @returns {Promise<Array<Object>>} Una promesa que resuelve con la lista de pacientes.
   */
  fetchCitedPatients: async () => {
    try {
      // Simular un retardo de red para emular una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockCitas = [
        { id: 'P001', nombre: 'Juan Pérez', sexo: 'Masculino', edad: 30, horaCita: '09:00 AM' },
        { id: 'P002', nombre: 'María García', sexo: 'Femenino', edad: 25, horaCita: '09:30 AM' },
        { id: 'P003', nombre: 'Carlos Ruiz', sexo: 'Masculino', edad: 50, horaCita: '10:00 AM' },
        { id: 'P004', nombre: 'Ana López', sexo: 'Femenino', edad: 40, horaCita: '10:30 AM' },
        { id: 'P005', nombre: 'Pedro Gómez', sexo: 'Masculino', edad: 65, horaCita: '11:00 AM' },
        { id: 'P006', nombre: 'Laura Fernández', sexo: 'Femenino', edad: 33, horaCita: '11:30 AM' },
        { id: 'P007', nombre: 'Sofía Martínez', sexo: 'Femenino', edad: 28, horaCita: '12:00 PM' },
        { id: 'P008', nombre: 'Diego Sánchez', sexo: 'Masculino', edad: 42, horaCita: '12:30 PM' },
      ];

      // Ordenar por hora de cita
      const sortedCitas = mockCitas.sort((a, b) => a.horaCita.localeCompare(b.horaCita));

      return sortedCitas;
    } catch (error) {
      console.error("Error al obtener pacientes citados:", error);
      // Es crucial relanzar el error para que el componente que llama pueda manejarlo
      throw new Error("No se pudieron cargar los pacientes citados. Inténtalo de nuevo más tarde.");
    }
  },

  /**
   * Simula la obtención de los datos de un paciente por su ID.
   * @param {string} patientId - El ID del paciente a buscar.
   * @returns {Promise<Object|null>} Una promesa que resuelve con los datos del paciente o null si no se encuentra.
   */
  fetchPatientById: async (patientId) => {
    try {
      // Simular un retardo de red
      await new Promise(resolve => setTimeout(resolve, 300));

      const allPatients = await PatientService.fetchCitedPatients(); // Reutilizar la lista mock
      const foundPatient = allPatients.find(p => p.id === patientId);

      if (!foundPatient) {
        console.warn(`Paciente con ID ${patientId} no encontrado.`);
        return null;
      }
      return foundPatient;
    } catch (error) {
      console.error(`Error al obtener paciente con ID ${patientId}:`, error);
      throw new Error(`No se pudo cargar el paciente con ID ${patientId}.`);
    }
  },

  // Aquí se podrían añadir más funciones para otras operaciones con pacientes,
  // como addPatient, updatePatient, deletePatient, etc.
};

export default AtencionMedicaPacienteDatosService;
