import React, { useState } from 'react';
import { RolService } from '../services/rol.service';

const RolForm = ({ onRolCreado }) => {
    const [nombre, setNombre] = useState('');
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre.trim()) return;

        try {
            setLoading(true);
            const nuevoRol = await RolService.createRol({ nombre: nombre.trim() });
            
            setMensaje({ texto: `¡Rol "${nombre}" creado exitosamente desde la aplicación!`, tipo: 'success' });
            setNombre('');
            
            if (onRolCreado) {
                onRolCreado(nuevoRol);
            }
        } catch (err) {
            setMensaje({ texto: 'Error al registrar el rol. Es posible que ya exista en el sistema.', tipo: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Crear Nuevo Rol</h3>

            {mensaje.texto && (
                <div className={`mb-4 p-3 rounded text-sm ${mensaje.tipo === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {mensaje.texto}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Rol:</label>
                    <input 
                        type="text" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                        placeholder="Ej. Medico_independiente"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500" 
                        required 
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200 disabled:opacity-50"
                >
                    {loading ? 'Guardando...' : 'Registrar Rol'}
                </button>
            </form>
        </div>
    );
};

export default RolForm;