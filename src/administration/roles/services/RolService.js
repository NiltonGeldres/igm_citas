import axios from 'axios';

const API_URL = process.env.REACT_APP_URL_API || 'https://tu-api-en-render.com';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

export const RolService = {
    // Obtener todos los roles
    getAllRoles: async () => {
        const response = await axios.get(`${API_URL}/api/v1/roles`, getAuthHeaders());
        return response.data;
    },

    // Crear un nuevo rol (ej. "Medico_independiente")
    createRol: async (rolData) => {
        const response = await axios.post(`${API_URL}/api/v1/roles`, rolData, getAuthHeaders());
        return response.data;
    }
};