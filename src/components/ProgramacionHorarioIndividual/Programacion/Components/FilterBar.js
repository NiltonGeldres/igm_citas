import React from 'react';
import { Icon } from "../Components/Icons"; // Importación correcta

/**
 * Componente para la barra de filtros (Servicio y Usuario/Rol).
 */
const FilterBar = () => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-lg mb-6 border border-gray-100">
            <div className="flex flex-wrap items-center gap-4">
                {/* Filtro de Servicio */}
                <div className="flex items-center space-x-2">
                    <Icon name="PackagePlus" className="w-5 h-5 text-indigo-500" />
                    <label htmlFor="service-filter" className="text-sm font-medium text-gray-700">Servicio:</label>
                    <select id="service-filter" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm">
                        <option>Emergencias</option>
                        <option>Hospitalización</option>
                        <option>UCI</option>
                    </select>
                </div>
                {/* Filtro de Usuario/Rol */}
                <div className="flex items-center space-x-2">
                    <Icon name="UserPlus" className="w-5 h-5 text-indigo-500" />
                    <label htmlFor="user-filter" className="text-sm font-medium text-gray-700">Usuario/Rol:</label>
                    <select id="user-filter" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm">
                        <option>Mi Horario</option>
                        <option>Todos los Médicos</option>
                        <option>Enfermeros</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;