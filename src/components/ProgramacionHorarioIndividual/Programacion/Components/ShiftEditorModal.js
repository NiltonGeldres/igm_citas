import React, {  useCallback} from 'react';
import { Icon } from "../Components/Icons.js"; 
import { SHIFTS_DATA } from "../Data/data.js"; 

/**
 * Modal para editar individualmente los turnos de un día.
 */
const ShiftEditorModal = ({ isOpen, day, onClose }) => {
    // Si el modal no está abierto, no renderizar nada.
    if (!isOpen) return null;

    // Lógica mock para turnos seleccionados en el día
    // En una aplicación real, esto se manejaría con un estado global o props.
    const currentShifts = ['morning', 'evening']; // Mock de turnos existentes

const toggleShift = useCallback((shiftId) => {
        // Lógica de toggle simulada: Solo para consola, no afecta el estado
        console.log(`Toggle shift ${shiftId} for day ${day}`);
    }, [day]);
    
    // LÓGICA CONDICIONAL: Va DESPUÉS de todos los hooks.
    if (!isOpen) return null;

    return (
        // Overlay (Fondo oscuro)
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={onClose}>
            
            {/* Contenedor del Modal */}
            <div 
                className="bg-white rounded-xl shadow-2xl max-w-lg w-full transform transition-all scale-100"
                onClick={e => e.stopPropagation()} // Evita que el clic dentro del modal lo cierre
            >
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                        <Icon name="Clock" className="w-6 h-6 mr-3 text-indigo-600" />
                        Editar Turnos - Día {day || ''}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1" aria-label="Cerrar">
                        <Icon name="X" className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <p className="text-gray-600">Selecciona o deselecciona los turnos disponibles para este día.</p>
                    
                    {SHIFTS_DATA.map(shift => {
                        const isSelected = currentShifts.includes(shift.id);
                        return (
                            <div
                                key={shift.id}
                                className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition ${isSelected ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-300' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                                onClick={() => toggleShift(shift.id)}
                            >
                                <div className="flex items-center">
                                    <Icon name={shift.icon} className={`w-6 h-6 mr-4 ${isSelected ? 'text-indigo-600' : 'text-gray-500'}`} />
                                    <div>
                                        <p className="font-medium text-lg text-gray-900">{shift.name}</p>
                                        <p className="text-sm text-gray-500">{shift.time}</p>
                                    </div>
                                </div>
                                {isSelected && <Icon name="CheckCircle" className="w-6 h-6 text-indigo-500" />}
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-6 border-t flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={() => { console.log('Guardando cambios...'); onClose(); }}
                        className="px-5 py-2 rounded-lg font-bold transition shadow-md bg-indigo-600 hover:bg-indigo-700 text-white flex items-center"
                    >
                        <Icon name="Save" className="w-5 h-5 mr-2" />
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShiftEditorModal;