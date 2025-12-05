// Archivo: ProgramacionMedicaIndividualService.js

/**
 * URL base para las llamadas a la API.
 * DEBE ser actualizada con la URL real de tu backend.
 */
const API_BASE_URL = 'http://localhost:8080/api/agenda'; 

// --- MOCK DATA (Datos de prueba que simulan la respuesta de tu API) ---

const MOCK_SERVICIOS = [
    { id: 1, nombre: 'Consulta General', icono: 'Stethoscope' },
    { id: 2, nombre: 'Odontología', icono: 'Tooth' },
    { id: 3, nombre: 'Cardiología', icono: 'HeartPulse' },
    { id: 4, nombre: 'Fisioterapia', icono: 'Dumbbell' },
];

const MOCK_TURNOS = [
    { id: 'shift_morn', nombre: 'Mañana', hora_inicio: '08:00', hora_fin: '12:00', duracion_min: 240 },
    { id: 'shift_noon', nombre: 'Tarde', hora_inicio: '12:00', hora_fin: '16:00', duracion_min: 240 },
    { id: 'shift_late', nombre: 'Vespertino', hora_inicio: '16:00', hora_fin: '20:00', duracion_min: 240 },
    // El turno 'Libre' o 'Free' generalmente se maneja en el frontend,
    // pero si viene del backend, se incluye aquí.
    { id: 'free', nombre: 'Libre (Sin Asignación)', hora_inicio: '-', hora_fin: '-', duracion_min: 0 },
];

// ----------------------------------------------------------------------

const ProgramacionMedicaIndividualService = {

    /**
     * Obtiene la lista de servicios/especialidades.
     * @returns {Promise<Array>} Una promesa que resuelve con la lista de servicios.
     */
    fetchServicios: async () => {
        console.log('ProgramacionMedicaIndividualService: Intentando obtener Servicios...');
        try {
            // --- SIMULACIÓN DE LLAMADA API ---
            // En un entorno real, descomentarías el código de abajo y comentarías el setTimeout.
            /*
            const response = await fetch(`${API_BASE_URL}/servicios`);
            if (!response.ok) {
                throw new Error('Error al cargar los servicios.');
            }
            const data = await response.json();
            return data;
            */
           
            // SIMULACIÓN: Espera 500ms para imitar la latencia de red
            await new Promise(resolve => setTimeout(resolve, 500));
            
            console.log('ProgramacionMedicaIndividualService: Servicios cargados exitosamente.');
            return MOCK_SERVICIOS;

        } catch (error) {
            console.error("Error en fetchServicios:", error);
            // En un caso real, podrías lanzar el error o devolver una lista vacía.
            throw new Error("No se pudo conectar con el servicio de Servicios.");
        }
    },

    /**
     * Obtiene la lista de turnos disponibles.
     * @returns {Promise<Array>} Una promesa que resuelve con la lista de turnos.
     */
    fetchTurnos: async () => {
        console.log('ProgramacionMedicaIndividualService: Intentando obtener Turnos...');
        try {
            // --- SIMULACIÓN DE LLAMADA API ---
            /*
            const response = await fetch(`${API_BASE_URL}/turnos`);
            if (!response.ok) {
                throw new Error('Error al cargar los turnos.');
            }
            const data = await response.json();
            return data;
            */
            
            // SIMULACIÓN: Espera 300ms para imitar la latencia de red
            await new Promise(resolve => setTimeout(resolve, 300));

            console.log('ProgramacionMedicaIndividualService: Turnos cargados exitosamente.');
            return MOCK_TURNOS;
            
        } catch (error) {
            console.error("Error en fetchTurnos:", error);
            throw new Error("No se pudo conectar con el servicio de Turnos.");
        }
    },

    // Agregaremos aquí el resto de métodos CRUD (Guardar, Actualizar, Eliminar) más adelante.
    // saveSchedule: async (data) => { ... },
};

export default ProgramacionMedicaIndividualService;