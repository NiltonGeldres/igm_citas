import React from 'react';
import { Icon } from './Icons.js'; // Importación correcta
import { SHIFTS_DATA } from "../Data/data.js"; // Importación de datos de turnos
import { CheckCircle, Clock } from 'lucide-react';

/**
 * Panel para la programación masiva de turnos.
 */
const BulkScheduler = ({ selectedShifts, toggleShift, applyToAllDays, applyBulkSchedule }) => (
    <div className="bg-white p-5 rounded-xl shadow-xl border border-gray-200 h-fit mb-6 lg:mb-0">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Programación Masiva</h3>
        
        <p className="text-sm font-semibold text-gray-700 mb-2">1. Selecciona Turnos:</p>
        <div className="space-y-2 mb-4">
            {SHIFTS_DATA.map(shift => (
                <div 
                    key={shift.id} 
                    onClick={() => toggleShift(shift.id)}
                    className={`p-3 rounded-lg cursor-pointer transition flex justify-between items-center ${
                        selectedShifts.includes(shift.id) 
                            ? 'bg-indigo-100 border-indigo-500 border-2' 
                            : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }`}
                >
                    <span className="font-medium text-sm">{shift.name} ({shift.time})</span>
                    {selectedShifts.includes(shift.id) && <CheckCircle className="w-4 h-4 text-indigo-600" />}
                </div>
            ))}
        </div>

        <div className="mt-6 flex flex-col space-y-3">
            <button 
                onClick={applyToAllDays} 
                className="w-full py-2 text-sm bg-blue-100 text-blue-800 font-semibold rounded-lg hover:bg-blue-200 transition"
            >
                Seleccionar Todos los 30 Días
            </button>
            <button 
                onClick={applyBulkSchedule}
                disabled={selectedShifts.length === 0}
                className="w-full py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 transition disabled:bg-gray-400"
            >
                Aplicar Programación ({selectedShifts.length} turnos)
            </button>
        </div>
    </div>
);


export default BulkScheduler;