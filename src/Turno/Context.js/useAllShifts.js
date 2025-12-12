
// --- 2. CONTEXTO EXCLUSIVO PARA ALL_SHIFTS ---
const AllShiftsContext = createContext(null); 

/**
 * Hook personalizado para consumir el contexto de ALL_SHIFTS.
 */
export const useAllShifts = () => {
    const context = useContext(AllShiftsContext);
    if (context === null) {
        throw new Error('useAllShifts debe ser usado dentro de un AllShiftsProvider');
    }
    return context;
};