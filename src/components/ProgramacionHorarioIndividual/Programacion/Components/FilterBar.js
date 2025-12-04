// =================================================================
// 1. SUBCOMPONENTES (Refactorizados con Bootstrap)
// =================================================================

/**
 * Componente para la barra de filtros.
 */
import Servicio from "../../../Servicio/Servicio"; 

// Componente para la barra de filtros (Mock)
const FilterBar = () => (
    <div className="card shadow-sm mb-4">
        <div className="card-body small text-secondary">
            <p className="mb-0">Filtros: Servicio A | Personal | Turno (Todos)</p>
        </div>
    </div>
);


export default FilterBar;