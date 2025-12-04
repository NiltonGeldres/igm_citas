// =================================================================
// 1. SUBCOMPONENTES (Refactorizados con Bootstrap)
// =================================================================

/**
 * Componente para la barra de filtros.
 */
const FilterBar = () => (
    <div className="card shadow-sm mb-4 p-3 border-0">
        <div className="d-flex flex-wrap gap-3 align-items-center">
            <select className="form-select w-auto">
                <option>Servicio: Emergencias</option>
                <option>Servicio: Consulta</option>
            </select>
            <select className="form-select w-auto">
                <option>Usuario/Rol: Mi Horario</option>
                <option>Usuario/Rol: Médico A</option>
            </select>
        </div>
    </div>
);



export default FilterBar;