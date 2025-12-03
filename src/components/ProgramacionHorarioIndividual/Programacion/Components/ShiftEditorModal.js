import React from 'react';
import { Icon } from "../Components/Icons.js";
import { SHIFTS_DATA } from "../Data/data.js";
import { X } from 'lucide-react';
/**
 * Modal para editar individualmente los turnos de un día.
 */
const ShiftEditorModal = ({ isOpen, day, onClose }) => {
    if (!isOpen || day === null) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Editar Turnos - Día {day}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <p className="text-gray-600 mb-4">Aquí se editarían los turnos individualmente para el día {day}.</p>
                {/* Mock de lista de turnos para edición */}
                <div className="space-y-2 mb-6">
                    {SHIFTS_DATA.map(shift => (
                         <div key={shift.id} className="p-3 border rounded-lg bg-gray-50 flex justify-between items-center">
                            <span className="font-medium">{shift.name}</span>
                            <input type="checkbox" className="form-checkbox text-indigo-600 h-5 w-5 rounded focus:ring-indigo-500" defaultChecked={Math.random() > 0.5} />
                         </div>
                    ))}
                </div>
                <div className="flex justify-end space-x-3">
                    <button 
                         onClick={onClose} 
                         className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
                     >
                         Cancelar
                     </button>
                    <button 
                        onClick={onClose} // Simular guardado
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
};


export default ShiftEditorModal;