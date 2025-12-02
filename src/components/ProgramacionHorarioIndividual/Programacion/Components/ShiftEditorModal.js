import React, {  useCallback} from 'react';
import { Icon } from "../Components/Icons.js"; 
import { SHIFTS_DATA } from "../Data/data.js"; 
import { X } from 'lucide-react';
/**
 * Modal para editar individualmente los turnos de un día.
 */
// Mock para ShiftEditorModal (Modal de Edición Individual)
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
                <div className="flex justify-end">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export  default ShiftEditorModal;