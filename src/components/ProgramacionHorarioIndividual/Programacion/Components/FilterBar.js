import React from 'react';
import { Icon } from "../Components/Icons"; // Importación correcta

/**
 * Componente para la barra de filtros (Servicio y Usuario/Rol).
 */
// Mock para FilterBar
const FilterBar = () => (
    <div className="bg-white p-4 rounded-xl shadow-lg mb-6 flex space-x-4 items-center border border-gray-200">
        <select className="border rounded-lg p-2 text-sm bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
            <option>Servicio: Emergencias</option>
            <option>Servicio: Consulta</option>
        </select>
        <select className="border rounded-lg p-2 text-sm bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
            <option>Usuario/Rol: Mi Horario</option>
            <option>Usuario/Rol: Médico A</option>
        </select>
    </div>
);


export default FilterBar;