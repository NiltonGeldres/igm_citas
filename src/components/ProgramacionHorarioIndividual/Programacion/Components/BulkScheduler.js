import React from 'react';
import { Icon } from './Icons.js'; // Importación correcta
import { SHIFTS_DATA } from "../Data/data.js"; // Importación de datos de turnos

/**
 * Panel para la programación masiva de turnos.
 */
const BulkScheduler = ({ selectedShifts, toggleShift, applyToAllDays, applyBulkSchedule }) => {
    const isReadyToApply = selectedShifts.length > 0;

    return (
        <div className="bg-white p-5 rounded-xl shadow-xl border border-gray-200 h-fit sticky top-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Icon name="CalendarPlus" className="w-6 h-6 mr-2 text-green-600" />
                Programación Masiva
            </h2>
            <p className="text-sm text-gray-600 mb-4 border-b pb-3">
                1. Selecciona los turnos, 2. Marca los días en el calendario, 3. Aplica.
            </p>

            {/* Selector de Turnos */}
            <h3 className="text-md font-semibold text-gray-700 mb-3">Turnos a Aplicar:</h3>
            <div className="space-y-3 mb-6">
                {SHIFTS_DATA.map(shift => {
                    const isSelected = selectedShifts.includes(shift.id);
                    return (
                        <div
                            key={shift.id}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${isSelected ? 'bg-green-50 border-green-500 ring-2 ring-green-300' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                            onClick={() => toggleShift(shift.id)}
                        >
                            <div className="flex items-center">
                                <Icon name={shift.icon} className={`w-5 h-5 mr-3 ${isSelected ? 'text-green-600' : 'text-gray-500'}`} />
                                <div>
                                    <p className="font-medium text-sm">{shift.name}</p>
                                    <p className="text-xs text-gray-500">{shift.time}</p>
                                </div>
                            </div>
                            {isSelected && <Icon name="CheckCircle" className="w-5 h-5 text-green-500" />}
                        </div>
                    );
                })}
            </div>

            {/* Opciones y Aplicación */}
            <div className="space-y-3">
                <button 
                    onClick={applyToAllDays}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                >
                    <Icon name="SaveAll" className="w-5 h-5 mr-2" />
                    Seleccionar Todo el Mes
                </button>

                <button 
                    onClick={applyBulkSchedule}
                    disabled={!isReadyToApply}
                    className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-bold transition shadow-lg ${isReadyToApply ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                    <Icon name="Save" className="w-5 h-5 mr-2" />
                    Aplicar Programación
                </button>
            </div>
        </div>
    );
};

export default BulkScheduler;