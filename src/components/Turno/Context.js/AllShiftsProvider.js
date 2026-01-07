
// 1. AllShiftsProvider: Componente que invoca el servicio y gestiona el estado.
function AllShiftsProvider({ children }) {
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // *** ESTE ES EL NUEVO INVOCADOR ***
        TurnoService.getAllShifts() 
            .then(data => setShifts(data)) 
            .catch(error => console.error("Error al cargar:", error))
            .finally(() => setLoading(false));
    }, []);

    const contextValue = { shifts, loading };

    return (
        <ShiftsContext.Provider value={contextValue}>
            {children}
        </ShiftsContext.Provider>
    );
}
