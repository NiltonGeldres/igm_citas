/**
 * Componente Provider que gestiona el estado y la carga de datos del nuevo servicio.
 */
const AllShiftsProvider = ({ children }) => {
    const [allShifts, setAllShifts] = useState([]); // Almacena la lista (ALL_SHIFTS)
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función que llama al NUEVO método del TurnoService
    const fetchAllShifts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Llamada al servicio agregado
            const response = await TurnoService.getAllShifts();
            
            // 2. Extraemos la data (estructura típica de Axios)
            if (response && response.data) {
                setAllShifts(response.data);
            } else {
                setAllShifts([]);
            }
        } catch (err) {
            console.error("Error al cargar ALL_SHIFTS:", err);
            setError("Error al obtener la programación de turnos. Intente de nuevo.");
            setAllShifts([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar los turnos solo al montar el componente
    useEffect(() => {
        fetchAllShifts();
    }, []);

    // Objeto con los valores que se proveerán
    const contextValue = {
        allShifts, 
        isLoading,
        error,
        refetchAllShifts: fetchAllShifts,
    };

    return (
        <AllShiftsContext.Provider value={contextValue}>
            {children}
        </AllShiftsContext.Provider>
    );
};

