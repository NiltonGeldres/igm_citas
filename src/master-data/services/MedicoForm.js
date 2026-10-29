import React, { useState } from 'react';

const MedicoForm = ({ idEntidad, onMedicoRegistrado }) => {
    const [formData, setFormData] = useState({
        dni: '',
        nombres: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        email: '',
        numeroCelular: '',
        passwordTemporal: '',
        colegiatura: '',
        idSexo: 1, // 1: Masculino, 2: Femenino (según tu catastro)
        idTipoDocumento: 1, // 1: DNI
        idCondicionTrabajo: 1,
        idTipoEmpleado: 1,
        idArea: 1,
        idTipoFinanciamiento: 1,
        idBanco: 1,
        numeroCuenta: '',
        codigoPlanilla: '',
        fechaNacimiento: '',
        usuarioSistema: 'admin_web',
        idRol: 4 // Rol 4: Medicos (según tu tabla de roles)
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        // Inyectamos la entidad actual del contexto o props
        const payload = { ...formData, idEntidad: Number(idEntidad) };

        try {
            const response = await fetch('https://tu-api-en-render.com/api/medicos/registrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` // Si usas JWT
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Error al registrar el médico');
            }

            setSuccessMsg(`¡Médico registrado con éxito! ID: ${data.idMedico}`);
            if (onMedicoRegistrado) onMedicoRegistrado(data.idMedico);
            
            // Limpiar formulario o resetear
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Registrar Nuevo Médico</h2>
            
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
            {successMsg && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{successMsg}</div>}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">DNI</label>
                    <input 
                        type="text" 
                        name="dni" 
                        value={formData.dni} 
                        onChange={handleChange} 
                        required 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombres</label>
                    <input 
                        type="text" 
                        name="nombres" 
                        value={formData.nombres} 
                        onChange={handleChange} 
                        required 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Apellido Paterno</label>
                    <input 
                        type="text" 
                        name="apellidoPaterno" 
                        value={formData.apellidoPaterno} 
                        onChange={handleChange} 
                        required 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Apellido Materno</label>
                    <input 
                        type="text" 
                        name="apellidoMaterno" 
                        value={formData.apellidoMaterno} 
                        onChange={handleChange} 
                        required 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Colegiatura (CMP)</label>
                    <input 
                        type="text" 
                        name="colegiatura" 
                        value={formData.colegiatura} 
                        onChange={handleChange} 
                        required 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Celular</label>
                    <input 
                        type="text" 
                        name="numeroCelular" 
                        value={formData.numeroCelular} 
                        onChange={handleChange} 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Contraseña Temporal</label>
                    <input 
                        type="password" 
                        name="passwordTemporal" 
                        value={formData.passwordTemporal} 
                        onChange={handleChange} 
                        required 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div className="md:col-span-2 mt-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-semibold p-2 rounded-md hover:bg-blue-700 transition"
                    >
                        {loading ? 'Registrando...' : 'Guardar Médico'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MedicoForm;