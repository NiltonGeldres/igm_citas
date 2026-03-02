
/*
const getTodos = () => {
    return axios.post(API_URL+SERVICE
         ,{}
          ,{ headers: header()}
        ).catch(function (error) {
          console.log(error.toJSON());
        });
};

const getXUsuario = () => {
  return axios.post(API_URL+SERVICE_X_USUARIO
       ,{usuario}
        ,{ headers: header()}
      ).catch(function (error) {
        console.log(error.toJSON());
      });
};

const getXEntidad = () => {
    return axios.post(API_URL+SERVICE_X_ENTIDAD
         ,{}
          ,{ headers: header()}
        ).catch(function (error) {
          console.log(error.toJSON());
        });
};

*///const usuario = sessionStorage.getItem('username');


/********************************************************** */


import React, { useState } from 'react';

/**
 * ENTIDAD DE NEGOCIO (Frontend)
 * Este es el contrato que mis componentes de React esperan.
 * No importa si el backend cambia el nombre de la columna,
 * solo cambio el mapper y la UI sigue funcionando.
 */

const EspecialidadeMapper = {
  /**
   * MAPPER UNIVERSAL
   * @param {Object} raw - El JSON crudo que viene de CUALQUIER endpoint de pacientes.
   */
  toEntity(raw) {
    if (!raw) return null;

    // Lógica de composición de nombres (Reutilizable para todos los casos)
    const nombreCompleto = [
      raw.apellidopaterno,
      raw.apellidomaterno,
      raw.primernombre,
      raw.segundonombre
    ].filter(Boolean).join(' ');

    // Retornamos un objeto estandarizado
    return {
      id: raw.idpaciente,
      nroHistoria: raw.nrohistoriaclinica || raw.hc, // Soporta diferentes nombres del backend
      documento: raw.nrodocumento,
      nombreCompleto: nombreCompleto || raw.nombre_completo_backend,
      fechaIngreso: raw.fechanacimiento || raw.fecha_registro,
      
      // Datos que pueden ser opcionales según el endpoint
      sexo: raw.idtiposexo === 1 ? 'Masculino' : 'Femenino',
      distrito: raw.distrito_nombre || 'No cargado',
      
      // Mantenemos los IDs por si se necesitan para otras consultas
      ids: {
        distrito: raw.iddistritodomicilio,
        sexo: raw.idtiposexo
      }
    };
  }
};

/**
 * SERVICIO DE PACIENTES
 * Aquí manejamos los 3 casos que solicitaste.
 */
const PacienteService = {
  
  // Caso 1: Pacientes por apellido -> Devuelve Historia y Fecha
  async buscarPorApellidos(apellidos) {
    try {
      // Simulamos llamada a: GET /api/v1/pacientes/buscar?apellidos=...
      const response = [
        { idpaciente: 1, nrohistoriaclinica: "HC-001", fechanacimiento: "2023-10-01", apellidopaterno: apellidos, primernombre: "Juan" }
      ];
      return response.map(PacienteMapper.toEntity);
    } catch (e) { throw new Error("Error en búsqueda por apellido"); }
  },

  // Caso 2: Paciente por Historia -> Devuelve Fecha y Nombres
  async obtenerPorHistoria(nro) {
    // Simulamos llamada a: GET /api/v1/pacientes/historia/HC-001
    const response = { 
      idpaciente: 1, 
      nrohistoriaclinica: nro, 
      fechanacimiento: "2023-10-01", 
      primernombre: "Juan", 
      apellidopaterno: "Perez" 
    };
    return PacienteMapper.toEntity(response);
  },

  // Caso 3: Paciente por Nombre (Completo) -> Devuelve Distrito, HC, Sexo, etc.
  async buscarAvanzado(nombre) {
    // Simulamos respuesta con JOINs del backend
    const response = [
      { 
        idpaciente: 1, 
        nrohistoriaclinica: "HC-001", 
        primernombre: nombre, 
        apellidopaterno: "Perez",
        idtiposexo: 1,
        distrito_nombre: "Miraflores", // El backend ya hizo el JOIN
        iddistritodomicilio: 50
      }
    ];
    return response.map(PacienteMapper.toEntity);
  }
};

/**
 * VISTA DE EJEMPLO
 */
export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const testCaso = async (tipo) => {
    setLoading(true);
    let result;
    if (tipo === 1) result = await PacienteService.buscarPorApellidos("Perez");
    if (tipo === 2) {
      const p = await PacienteService.obtenerPorHistoria("HC-123");
      result = [p];
    }
    if (tipo === 3) result = await PacienteService.buscarAvanzado("Juan");
    
    setData(result);
    setLoading(false);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-800">
      <h1 className="text-2xl font-bold mb-6 text-slate-700">Sistema de Gestión de Pacientes</h1>
      
      <div className="flex gap-4 mb-8">
        <button onClick={() => testCaso(1)} className="bg-white border border-slate-300 px-4 py-2 rounded shadow-sm hover:bg-slate-100 transition">Caso 1: Apellidos</button>
        <button onClick={() => testCaso(2)} className="bg-white border border-slate-300 px-4 py-2 rounded shadow-sm hover:bg-slate-100 transition">Caso 2: Nro Historia</button>
        <button onClick={() => testCaso(3)} className="bg-white border border-slate-300 px-4 py-2 rounded shadow-sm hover:bg-slate-100 transition">Caso 3: Avanzado</button>
      </div>

      {loading ? (
        <div className="text-center p-10">Cargando datos del paciente...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map(p => (
            <div key={p.id} className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{p.nombreCompleto}</h3>
                  <p className="text-sm text-slate-500">HC: <span className="font-mono font-bold text-indigo-600">{p.nroHistoria}</span></p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${p.sexo === 'Masculino' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                  {p.sexo}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-slate-50 p-2 rounded">
                  <span className="block text-xs text-slate-400">Fecha Ingreso</span>
                  {p.fechaIngreso}
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <span className="block text-xs text-slate-400">Distrito Domicilio</span>
                  {p.distrito}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
/************************************************* */

import React, { useState } from 'react';

/**
 * ARCHIVO: /services/paciente/PacienteMapper.js
 * Transforma los datos crudos de la BD (PostgreSQL) a Entidades de Negocio.
 */
const PacienteMapper = {
  // Transforma un registro completo de la tabla a una entidad limpia
  toEntity(row) {
    if (!row) return null;

    // Lógica para concatenar nombres
    const nombres = [row.primernombre, row.segundonombre, row.tercernombre]
      .filter(n => n && n.trim() !== '')
      .join(' ');
    
    const apellidos = [row.apellidopaterno, row.apellidomaterno]
      .filter(a => a && a.trim() !== '')
      .join(' ');

    return {
      id: row.idpaciente,
      historiaClinica: row.nrohistoriaclinica,
      documento: row.nrodocumento,
      nombreCompleto: `${apellidos}, ${nombres}`.trim(),
      nombres: nombres,
      apellidos: apellidos,
      fechaNacimiento: row.fechanacimiento,
      // En un caso real, la "fecha de ingreso" podría venir de un join o ser el mismo timestamp
      fechaIngreso: row.fechanacimiento, 
      email: row.email,
      telefono: row.telefono,
      sexoId: row.idtiposexo,
      distritoId: row.iddistritodomicilio,
      // Estos campos suelen venir de JOINS en la consulta SQL
      distritoNombre: row.distrito_nombre_alias || 'No especificado' 
    };
  }
};

/**
 * ARCHIVO: /services/paciente/PacienteService.js
 * Coordina las llamadas a la API y utiliza el Mapper.
 */
const PacienteService = {
  // Simulación de endpoint: GET /pacientes?nombre=...
  async getPorNombre(apellidos) {
    // Simulando respuesta de BD
    const rawData = [
      { 
        idpaciente: 101, 
        nrohistoriaclinica: "HC-2023-001", 
        apellidopaterno: "Gomez", 
        apellidomaterno: "Perez", 
        primernombre: "Juan",
        fechanacimiento: "2023-01-15T10:00:00Z" 
      }
    ];
    return rawData.map(PacienteMapper.toEntity);
  },

  // Simulación de endpoint: GET /pacientes/historia/:nro
  async getPorHistoria(nroHistoria) {
    const row = { 
      idpaciente: 102, 
      nrohistoriaclinica: nroHistoria, 
      apellidopaterno: "Lopez", 
      primernombre: "Maria",
      fechanacimiento: "2022-05-20T08:30:00Z" 
    };
    return PacienteMapper.toEntity(row);
  },

  // Simulación para búsqueda avanzada (nombres, apellidos, sexo, distrito)
  async getBusquedaAvanzada(nombre) {
    const rawData = [
      { 
        idpaciente: 103, 
        nrohistoriaclinica: "HC-999", 
        apellidopaterno: "Rodriguez", 
        primernombre: "Carlos",
        idtiposexo: 1, // Masculino
        iddistritodomicilio: 150101, // Lima
        distrito_nombre_alias: "Miraflores"
      }
    ];
    return rawData.map(PacienteMapper.toEntity);
  }
};

/**
 * COMPONENTE DE UI: Buscador de Pacientes
 * Aquí aplicamos los Mappers de UI según lo solicitado.
 */
export default function App() {
  const [resultados, setResultados] = useState([]);
  const [tipoBusqueda, setTipoBusqueda] = useState('nombre');

  const ejecutarBusqueda = async (valor) => {
    let data;
    if (tipoBusqueda === 'nombre') {
      data = await PacienteService.getPorNombre(valor);
    } else if (tipoBusqueda === 'historia') {
      const p = await PacienteService.getPorHistoria(valor);
      data = p ? [p] : [];
    } else {
      data = await PacienteService.getBusquedaAvanzada(valor);
    }
    setResultados(data);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <div className="p-4 bg-indigo-700 text-white">
          <h2 className="text-xl font-bold">Gestión de Pacientes</h2>
        </div>

        <div className="p-4 flex gap-4 border-b">
          <select 
            className="border p-2 rounded" 
            value={tipoBusqueda}
            onChange={(e) => setTipoBusqueda(e.target.value)}
          >
            <option value="nombre">Por Nombre (HC y Fecha Ingreso)</option>
            <option value="historia">Por Historia (Nombres y Fecha)</option>
            <option value="avanzada">Búsqueda Avanzada (Distrito, Sexo, etc)</option>
          </select>
          <input 
            type="text" 
            placeholder="Escriba aquí..." 
            className="flex-1 border p-2 rounded outline-none focus:ring-2 focus:ring-indigo-300"
            onKeyDown={(e) => e.key === 'Enter' && ejecutarBusqueda(e.target.value)}
          />
        </div>

        <div className="p-4">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 uppercase text-xs font-bold text-gray-600">
                <th className="p-3 border-b">Historia</th>
                <th className="p-3 border-b">Paciente</th>
                <th className="p-3 border-b">Detalles Extra</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map(p => (
                <tr key={p.id} className="hover:bg-indigo-50 transition-colors">
                  <td className="p-3 border-b font-mono text-indigo-600 font-bold">{p.historiaClinica}</td>
                  <td className="p-3 border-b">
                    <div className="font-bold">{p.nombreCompleto}</div>
                    <div className="text-xs text-gray-400">Ingreso: {p.fechaIngreso}</div>
                  </td>
                  <td className="p-3 border-b text-gray-600">
                    {tipoBusqueda === 'avanzada' ? (
                      <div>
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs mr-2">Distrito: {p.distritoNombre}</span>
                        <span className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded text-xs">Sexo ID: {p.sexoId}</span>
                      </div>
                    ) : (
                      <span className="text-xs italic">Vista simplificada</span>
                    )}
                  </td>
                </tr>
              ))}
              {resultados.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-10 text-center text-gray-400 italic">No hay resultados. Presione Enter para buscar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
//*************************************************************** */

import React, { useState, useEffect } from 'react';

/**
 * MAPPERS (Mapeadores)
 * * Estas funciones puras se encargan de transformar la data.
 * * Si la API cambia un nombre de campo, SOLO cambias esto aquí.
 */
const EspecialidadMapper = {
  // Transforma la respuesta de la lista general
  toViewModel(apiItem) {
    return {
      id: apiItem.id_esp_med || 0,
      nombre: apiItem.nombre_oficial || 'Sin Nombre',
      precio: apiItem.val_consulta || 0,
      esActivo: apiItem.estado === 'A'
    };
  },

  // Transforma la respuesta de un detalle profundo (tabla grande)
  toDetailModel(apiDetail) {
    return {
      id: apiDetail.id_esp_med,
      descripcion: apiDetail.desc_larga_especialidad,
      requisitos: apiDetail.req_previos || [],
      medicosAsignados: (apiDetail.staff || []).map(m => ({
        nombreCompleto: `${m.nom} ${m.ape}`,
        matricula: m.cod_mat
      }))
    };
  },

  // Prepara el Request para enviar a la API (POST/PUT)
  toApiRequest(formState) {
    return {
      nom_esp: formState.nombre,
      costo: parseFloat(formState.precio),
      user_auditoria: "APP_REACT_USER"
    };
  }
};

/**
 * SERVICIO CENTRALIZADO
 */
const EspecialidadService = {
  // 1. Consulta simple (GET Listado)
  async fetchAll() {
    // Simulación de API
    const rawData = [
      { id_esp_med: 101, nombre_oficial: "Pediatría", val_consulta: 80, estado: 'A' },
      { id_esp_med: 102, nombre_oficial: "Neurología", val_consulta: 200, estado: 'A' }
    ];
    return rawData.map(EspecialidadMapper.toViewModel);
  },

  // 2. Consulta con Request específico (GET Detalle por ID)
  async fetchById(id) {
    // Simulación de respuesta de tabla grande con mucha data anidada
    const rawDetail = {
      id_esp_med: id,
      desc_larga_especialidad: "Especialidad dedicada al estudio del sistema nervioso...",
      req_previos: ["Ayuno 8hs", "Orden médica"],
      staff: [{ nom: "Juan", ape: "Pérez", cod_mat: "M123" }]
    };
    return EspecialidadMapper.toDetailModel(rawDetail);
  },

  // 3. Envío de datos (POST)
  async create(formData) {
    const payload = EspecialidadMapper.toApiRequest(formData);
    console.log("Enviando a la API:", payload);
    // return await fetch(..., { body: JSON.stringify(payload) });
    return { success: true };
  }
};

/**
 * COMPONENTE DE DEMOSTRACIÓN
 */
export default function App() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await EspecialidadService.fetchAll();
    setItems(data);
    setLoading(false);
  };

  const handleVerDetalle = async (id) => {
    setLoading(true);
    const detalle = await EspecialidadService.fetchById(id);
    setSelected(detalle);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-slate-50 min-h-screen font-sans">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Gestión de Especialidades</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Lado Izquierdo: Lista Mapeada */}
        <section className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">Listado General</h2>
          {loading && <div className="text-blue-500 text-sm italic">Procesando...</div>}
          <div className="space-y-3 mt-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center p-3 border rounded hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => handleVerDetalle(item.id)}>
                <div>
                  <p className="font-medium">{item.nombre}</p>
                  <p className="text-xs text-slate-400">ID Interno: {item.id}</p>
                </div>
                <button className="text-blue-600 text-sm font-bold hover:underline">Ver Detalle</button>
              </div>
            ))}
          </div>
        </section>

        {/* Lado Derecho: Detalle de Tabla Grande */}
        <section className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">Vista Detallada</h2>
          {selected ? (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Descripción de la API</label>
                <p className="text-slate-600 text-sm">{selected.descripcion}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Requisitos</label>
                <ul className="list-disc list-inside text-sm text-slate-600">
                  {selected.requisitos.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Médicos (Staff)</label>
                <div className="mt-2 space-y-2">
                  {selected.medicosAsignados.map((m, i) => (
                    <div key={i} className="text-xs bg-blue-50 text-blue-700 p-2 rounded">
                      {m.nombreCompleto} - <span className="font-mono">Mat: {m.matricula}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-sm italic">Selecciona una especialidad para ver el mapeo de la tabla grande.</p>
          )}
        </section>
      </div>
    </div>
  );
}



//*********************************************************************** */


import React, { useState, useEffect } from 'react';

/**
 * CONSTANTES DE CONFIGURACIÓN
 */
const API_URL = 'https://api.tu-servidor.com/especialidades'; // Reemplazar con URL real
const CACHE_KEY = 'cache_especialidades_v1';
const CACHE_EXPIRATION = 1000 * 60 * 60; // 1 hora

/**
 * FUNCIÓN PURA DE TRANSFORMACIÓN (MAPEO)
 * Convierte el formato crudo de la API al formato que el componente UI necesita.
 */
const transformarDatosEspecialidad = (rawItem) => ({
  id: rawItem.idEspecialidad,
  nombre: rawItem.descripcionEspecialidad.trim(),
  precio: rawItem.montoEspecialidad,
  precioFormateado: `$${rawItem.montoEspecialidad?.toLocaleString('es-CL')}`,
  // Añadimos metadatos útiles para la UI que no vienen de la API
  color: rawItem.montoEspecialidad > 100 ? 'text-blue-600' : 'text-green-600',
  ultimaActualizacion: new Date().toLocaleDateString()
});

/**
 * HOOK PERSONALIZADO: useEspecialidades
 * Este es el "Componente Lógico" que mencionas.
 */
export const useEspecialidades = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const ahora = Date.now();
        const cacheLocal = localStorage.getItem(CACHE_KEY);

        // 1. Intentar cargar desde Caché
        if (cacheLocal) {
          const { data, timestamp } = JSON.parse(cacheLocal);
          if (ahora - timestamp < CACHE_EXPIRATION) {
            setEspecialidades(data);
            setCargando(false);
            return;
          }
        }

        // 2. Si no hay caché o expiró, llamar a la API
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al conectar con el servidor');
        
        const rawData = await response.json();

        // 3. MAPEAR los datos inmediatamente (Limpieza)
        const datosListos = rawData.map(transformarDatosEspecialidad);

        // 4. GUARDAR en Caché los datos ya mapeados
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          timestamp: ahora,
          data: datosListos
        }));

        setEspecialidades(datosListos);
      } catch (err) {
        setError(err.message);
        // Fallback: Si la API falla, intentar usar la caché aunque esté expirada
        const fallbackCache = localStorage.getItem(CACHE_KEY);
        if (fallbackCache) {
          setEspecialidades(JSON.parse(fallbackCache).data);
        }
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, []);

  return { especialidades, cargando, error };
};

/**
 * COMPONENTE CITA (UI)
 * Solo consume la data lista. No sabe de APIs ni de Caché.
 */
export default function ComponenteCita() {
  const { especialidades, cargando, error } = useEspecialidades();

  if (cargando) return <div className="p-4 animate-pulse">Cargando especialidades...</div>;
  if (error && especialidades.length === 0) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Agendar Cita</h2>
      
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-600">Seleccione Especialidad</label>
        <select className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="">-- Seleccionar --</option>
          {especialidades.map((esp) => (
            <option key={esp.id} value={esp.id}>
              {esp.nombre} ({esp.precioFormateado})
            </option>
          ))}
        </select>
      </div>

      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Continuar
      </button>

      {error && <p className="text-xs text-orange-500 italic">Mostrando datos locales (sin conexión)</p>}
    </div>
  );
}

// Exportamos como App para el entorno de ejecución
export const App = ComponenteCita;

/************************************************************** */

// src/App.js
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AuthService from "./components/Login/services/auth.service";
import Login from "./components/Login/Login";
import Usuario from "./components/Usuario/Usuario"; 
import UsuarioService from "./services/usuario.service"; 
import { jwtDecode } from "jwt-decode"; 

// Importaciones de Chakra UI
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Box, Flex, Button, Text, Link as ChakraLink, HStack, Spacer } from '@chakra-ui/react';

// Definir un tema básico para Chakra UI (puedes expandirlo)
const theme = extendTheme({
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50', 
        color: 'gray.800',
      },
    },
  },
});

function App() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null); 
  const [userId, setUserId] = useState(null); 
  const [userRoles, setUserRoles] = useState([]); 
  const [userProfileData, setUserProfileData] = useState(null); 

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser(); 
    if (currentUser && currentUser.jwtToken) { 
      setAuthUser(currentUser);
      try {
        const decodedToken = jwtDecode(currentUser.jwtToken);
        setUserId(decodedToken.userId); 
        setUserRoles(decodedToken.roles || []); 

        const storedProfile = sessionStorage.getItem("userProfile");
        if (storedProfile) {
          setUserProfileData(JSON.parse(storedProfile));
        } else {
          const usernameFromToken = decodedToken.sub; 
          if (usernameFromToken) {
            UsuarioService.leerUsuario(usernameFromToken)
              .then(response => {
                setUserProfileData(response.data);
                sessionStorage.setItem("userProfile", JSON.stringify(response.data));
              })
              .catch(error => {
                console.error("Error al recargar perfil en App.js:", error);
              });
          }
        }
      } catch (e) {
        console.error("Error decoding token on app load:", e);
        AuthService.logout(); 
        navigate("/login");
      }
    }
  }, [navigate]);

  const logOut = () => {
    AuthService.logout(); 
    setAuthUser(null);
    setUserId(null);
    setUserRoles([]); 
    setUserProfileData(null);
    navigate("/login");
  };

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" display="flex" flexDirection="column"> {/* Contenedor principal para layout de columna */}
        {/* Barra de navegación o header */}
        <Flex
          as="nav"
          align="center"
          justify="space-between"
          wrap="wrap"
          padding={4}
          bg="blue.600"
          color="white"
          boxShadow="md"
          width="full" // Ocupa todo el ancho
        >
          <Flex align="center" mr={5}>
            <Heading as="h1" size={{ base: "sm", md: "md" }} letterSpacing={"-.1rem"}> {/* Tamaño de título responsivo */}
              <ChakraLink onClick={() => navigate("/")} _hover={{ textDecoration: 'none' }}>
                Mi App Médica
              </ChakraLink>
            </Heading>
          </Flex>

          {/* Menú de navegación (oculto en móvil, visible en desktop) */}
          <HStack 
            spacing={{ base: 2, md: 4 }} // Espaciado responsivo
            display={{ base: "none", md: "flex" }} // Ocultar en móvil, mostrar en desktop
            alignItems="center"
          >
            {authUser ? (
              <>
                <Text fontSize={{ base: "sm", md: "md" }}> {/* Tamaño de texto responsivo */}
                  Bienvenido, {userProfileData?.primer_nombre || authUser.username || 'Usuario'}
                </Text>
                <Button variant="ghost" colorScheme="whiteAlpha" size={{ base: "sm", md: "md" }} onClick={() => navigate("/profile")}>
                  Mi Perfil
                </Button>
                {userRoles?.includes("ROLE_DOCTOR") && (
                  <Button variant="ghost" colorScheme="whiteAlpha" size={{ base: "sm", md: "md" }} onClick={() => navigate("/doctor-dashboard")}>
                    Dashboard Médico
                  </Button>
                )}
                {userRoles?.includes("ROLE_PATIENT") && (
                  <Button variant="ghost" colorScheme="whiteAlpha" size={{ base: "sm", md: "md" }} onClick={() => navigate("/patient-dashboard")}>
                    Dashboard Paciente
                  </Button>
                )}
                <Button colorScheme="red" size={{ base: "sm", md: "md" }} onClick={logOut}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" colorScheme="whiteAlpha" size={{ base: "sm", md: "md" }} onClick={() => navigate("/login")}>
                  Iniciar Sesión
                </Button>
                <Button colorScheme="green" size={{ base: "sm", md: "md" }} onClick={() => navigate("/signup")}>
                  Registrarse
                </Button>
              </>
            )}
          </HStack>
          
          {/* Botón de menú para móvil (visible solo en móvil) */}
          {/* Implementar un menú hamburguesa aquí si es necesario */}
          <Box display={{ base: "block", md: "none" }}>
            {/* Aquí iría un icono de hamburguesa y un componente de menú desplegable */}
            <Text color="white">Menú</Text> {/* Placeholder */}
          </Box>
        </Flex>

        {/* Contenido principal que se expande */}
        <Box flex="1" p={{ base: 2, md: 4 }}> {/* Padding responsivo y flex-grow */}
          <Routes>
            <Route path="/" element={<Text p={4}>Página de Inicio Pública</Text>} />
            <Route 
              path="/login" 
              element={
                <Login 
                  setAuthUser={setAuthUser}
                  setUserId={setUserId}
                  setUserRoles={setUserRoles}
                  setUserProfileData={setUserProfileData} 
                />
              } 
            />
            <Route path="/signup" element={<Text p={4}>Página de Registro</Text>} />

            {/* Rutas Protegidas */}
            {userId && userRoles && userRoles.length > 0 && (
              <>
                <Route 
                  path="/profile" 
                  element={<Usuario userId={userId} userRoles={userRoles} usuarioDataPrincipal={userProfileData} setUserProfileData={setUserProfileData} />} 
                />
                {userRoles?.includes("ROLE_DOCTOR") && (
                  <Route path="/doctor-dashboard" element={<Text p={4}>Dashboard Médico (Protegido)</Text>} />
                )}
                {userRoles?.includes("ROLE_PATIENT") && (
                  <Route path="/patient-dashboard" element={<Text p={4}>Dashboard Paciente (Protegido)</Text>} />
                )}
                <Route path="/private" element={<Text p={4}>Contenido Privado General (Protegido)</Text>} />
              </>
            )}
            <Route path="*" element={<Text p={4}>Página no encontrada o no autorizado.</Text>} />
          </Routes>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;

/*.....................................................................*/
   //  console.log("todos los turnos fuera Useffec:  "+JSON.stringify(TODOS_LOS_TURNOS))
  /*  const guardarHorario = useCallback((datosNuevos) => {
        console.log("GUARDAR ===> "+JSON.stringify(datosNuevos));
        setEstadoGuardado('guardando');
        setTimeout(() => {
            setEstadoGuardado('guardado');
            setTimeout(() => setEstadoGuardado(null), 2000);
        }, 600);
    }, []);
*/



/**................................................................... 
 * 
     const cargarProgramacionCompleta = useCallback(async () => {
        // 1. Preparar parámetros (estos vendrían de tus estados de filtros)
        const mes = fechaActual.getMonth() + 1;
        const anio = fechaActual.getFullYear();
        const idEspecialidad = 9; // id de ejemplo
        const idMedico = 1762;    // id de 
        
        console.log("DATA BLANCO cargarProgramacionCompleta   "+ mes+anio)

        setEstadoGuardado('guardando ');

        try {
            // 2. Llamada al Service
            const res = await ProgramacionHorarioIndividualService.getProgramacionMedicoMesBlanco(
                mes, anio, idEspecialidad, idMedico
            );
              console.log("DATA BLANCO "+JSON.stringify(res))

            if (res.data && Array.isArray(res.data)) {
                // 3. TRANSFORMACIÓN A MODELOS (La clave del éxito)
                // Convertimos cada objeto plano del JSON en un "Modelo Funcional"
                console.log("DATA BLANCO "+JSON.stringify(res.data))
                const modelosProcesados = res.data.map(item => crearProgramacionHorarioDia(item));

                // 4. ACTUALIZAR ESTADOS
                // Guardamos la lista completa de modelos (los 31 días)
                setDatosOriginalesBackend(modelosProcesados);

                // Generamos el mapa visual para el calendario { "2026-05-01": ["1"] }
                const mapaParaUI = mapearListaAUI(res.data);
                setHorarioCalendario(mapaParaUI);
                
                console.log("Datos cargados y modelados correctamente.");
            }
        } catch (error) {
            console.error("Error al obtener la programación del médico:", error);
        } finally {
            setEstadoGuardado(null);
        }
    }, [fechaActual]); 

    // Disparador automático al cambiar de mes/año
    useEffect(() => {
        cargarProgramacionCompleta();
    }, [cargarProgramacionCompleta]);

    const prepararDatosParaEnvio = (horarioUI, plantillaOriginal) => {
        // Recorremos la plantilla original (los 31 días que el backend nos envió)
        return plantillaOriginal.map(diaOriginal => {
            // 1. Obtenemos la clave de este día (ej: "2026-05-01")
            const clave = diaOriginal.getClaveCalendario();
            // 2. Buscamos qué seleccionó el usuario en el calendario de React
            const seleccionUI = horarioUI[clave]; // Devuelve ['1'], ['2'] o ['libre']
            // 3. Determinamos el ID del turno (0 si es libre)
            const nuevoIdTurno = (seleccionUI && seleccionUI[0] !== 'libre') 
                ? seleccionUI[0] 
                : 0;
            // 4. Usamos nuestro "Setter Inmutable" para crear el objeto actualizado
            const diaActualizado = actualizarTurnoEnDia(diaOriginal, nuevoIdTurno);
            // 5. IMPORTANTE: El backend no necesita la función 'getClaveCalendario'
            // Extraemos solo los datos puros (data transfer object)
            const { getClaveCalendario, ...datosLimpios } = diaActualizado;
            return datosLimpios;
        });
    };

    const guardarHorario = useCallback(async () => {
        setEstadoGuardado('guardando');
        try {
            // Generamos el array final de 31 objetos perfectamente modelados
            const datosFinales = prepararDatosParaEnvio(horarioCalendario, datosOriginalesBackend);

            console.log("JSON listo para la API:", datosFinales);
            // Llamada al servicio (POST / PUT)
            const respuesta = await ProgramacionHorarioIndividualService.guardarProgramacionMes(datosFinales);
            if (respuesta.status === 200) {
                setEstadoGuardado('guardado');
                // Opcional: Recargar datos del servidor para confirmar
                // cargarProgramacionExistente();
            }
        } catch (error) {
            console.error("Error al sincronizar con el backend:", error);
            setEstadoGuardado(null);
            alert("Hubo un error al guardar la programación.");
        } finally {
            // Quitamos el mensaje de "Guardado" después de 3 segundos
            setTimeout(() => setEstadoGuardado(null), 3000);
        }
    }, [horarioCalendario, datosOriginalesBackend]);
 
 */


    /**........................................................................... */
            // Estado para simular la programación actual de turnos en el calendario (Day: [Shift IDs])
            /*const [calendarSchedule, setCalendarSchedule] = useState({
                '3': ['morning', 'afternoon'],
                '15': ['morning', 'afternoon', 'evening'],
            });*/


/*..........................................

//export default ProgramacionHorarioPersonal:

/**
 // Dentro de export default function ProgramacionHorarioIndividual() { ...

// Función para obtener y formatear la data del servidor al estado del calendario
const cargarDatosPrevios = useCallback(async () => {
    setEstadoGuardado('guardando'); // Reutilizamos el estado para mostrar carga
    const mes = fechaActual.getMonth() + 1;
    const anio = fechaActual.getFullYear();
    const idEspecialidad = 1; // Obtener de tus filtros
    const idMedico = 1;       // Obtener de tu sesión o filtros
    try {
        const res = await ProgramacionHorarioIndividualService.getProgramacionMedicoMesBlanco(mes, anio, idEspecialidad, idMedico);
        if (res.data) {


            // Suponiendo que res.data viene en formato { "2024-05-01": ["turno1"], ... }
            // Si el JSON viene diferente, aquí debes mapearlo al formato de tu estado
            const dataConFormato = mapearAFormatoCalendario(res.data)
            setHorarioCalendario(dataConFormato);
        }
    } catch (error) {
        console.error("Error al cargar programación previa:", error);
    } finally {
        setEstadoGuardado(null);
    }
}, [fechaActual]);

const mapearAFormatoCalendario = (data) => {
    return data; 
}


// Efecto para cargar datos cada vez que la fecha (mes/año) cambia
useEffect(() => {
    cargarDatosPrevios();
}, [cargarDatosPrevios]);



// Actualizar la función guardarHorario para que sea real
const guardarHorario = useCallback(async (datosNuevos) => {
    setEstadoGuardado('guardando');
    
    try {
        // Aquí llamarías a tu servicio de GUARDADO (no al de carga "Blanco")
        // await ProgramacionService.guardar(datosNuevos);
        
        console.log("Datos a enviar:", datosNuevos);
        
        setEstadoGuardado('guardado');
        setTimeout(() => setEstadoGuardado(null), 2000);
    } catch (error) {
        setEstadoGuardado(null);
        alert("Error al guardar");
    }
}, []);


    const alternarTurnoMasivo = useCallback((turnoId) => {
        setTurnosMasivosSeleccionados(prev =>
            prev.includes(turnoId) ? prev.filter(id => id !== turnoId) : [...prev, turnoId]
        );
    }, []);
    

 */

    /*....................................................................*/

    /*    
        const cargarProgramacionCompleta = useCallback(async () => {
            // 1. Preparar parámetros desde el estado
            const mes = fechaActual.getMonth() + 1;
            const anio = fechaActual.getFullYear();
            const idEspecialidad = 9; // idealmente usar estado
            const idMedico = 1762;    // idealmente usar estado
            setEstadoGuardado('cargando'); // Feedback visual de carga
    
            try {
                // 2. Llamada al Service (Axios)
                const res = await ProgramacionHorarioIndividualService.obtenerProgramacionMesBlanco(
                    mes, anio, idEspecialidad, idMedico
                );
                // 3. El "Doble Data": res.data (Axios) -> .data (Java Wrapper)
                const envoltorioBack = res.data; 
                const listaRaw = envoltorioBack?.programacionMedicaDiaResponse;
                if (envoltorioBack && Array.isArray(listaRaw)) {
                    // A. Guardamos el "envoltorio" completo (totalRegistros, numeroPagina, etc.)
                    // Esto es lo que usaremos después para el guardado simétrico.
                    setEnvoltorioOriginal(envoltorioBack);
    
                    // B. Transformamos los días a Modelos Funcionales con getClaveCalendario()
                    const modelosProcesados = listaRaw.map(item => modelarDia(item));
                    setDatosOriginalesBackend(modelosProcesados);
    
                    // C. Generamos el mapa visual para el calendario React { "2026-08-01": ["1"] }
                    // Usamos los modelos ya procesados para aprovechar sus métodos internos
                    const mapaParaUI = modelosProcesados.reduce((acc, dia) => {
                        const clave = dia.getClaveCalendario();
                        // Si el turno es 0 lo mostramos como 'libre', si no, el ID como string
                        acc[clave] = dia.idTurno !== 0 ? [String(dia.idTurno)] : ['libre'];
                        return acc;
                    }, {});
    
                    setHorarioCalendario(mapaParaUI);
                    
                    console.log("Programación modelada con éxito:", envoltorioBack);
                }
            } catch (error) {
                console.error("Error al cargar programación médica:", error);
            } finally {
                setEstadoGuardado(null);
            }
        }, [fechaActual]); // Se dispara cuando cambias el mes en el calendario
    */

{
  "fecha":"12022026",
  "idEspecialidad":"9",
  "idServicio":"1",
  "idMedico":"1762",
  "programacion":[
    {
      "id":1,
      "idProgramacion":412,
      "horaInicio":null,
      "horaFin":null,
      "dia":1,
      "diaSemana":"DO",
      "fecha":"20260201",
      "tiempoPromedioAtencion":0,
      "idServicio":1,
      "idEspecialidad":9,
      "idMedico":1762,
      "idDepartamento":0,
      "idTurno":1,
      "descripcionTurno":"Mañana",
      "color":"lightgreen"
    },
    {

    },
     
    
    {
    "fecha": "12022026",
    "idEspecialidad": "9",
    "idServicio": "1",
    "idMedico": "1762",
    "programacion": [
        {
            "id": 1,
            "idProgramacion": 412,
            "horaInicio": "",
            "horaFin": "",
            "dia": 1,
            "diaSemana": "DO",
            "fecha": "20260201",
            "tiempoPromedioAtencion": 0,
            "idServicio": 1,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 1,
            "descripcionTurno": "Mañana",
            "color": "lightgreen"
        },
        {
            "id": 2,
            "idProgramacion": 413,
            "horaInicio": "",
            "horaFin": "",
            "dia": 2,
            "diaSemana": "LU",
            "fecha": "20260202",
            "tiempoPromedioAtencion": 0,
            "idServicio": 1,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 1,
            "descripcionTurno": "Mañana",
            "color": "lightgreen"
        },
        {
            "id": 3,
            "idProgramacion": 414,
            "horaInicio": "",
            "horaFin": "",
            "dia": 3,
            "diaSemana": "MA",
            "fecha": "20260203",
            "tiempoPromedioAtencion": 0,
            "idServicio": 1,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 1,
            "descripcionTurno": "Mañana",
            "color": "lightgreen"
        },
        {
            "id": 4,
            "idProgramacion": 415,
            "horaInicio": "",
            "horaFin": "",
            "dia": 4,
            "diaSemana": "MI",
            "fecha": "20260204",
            "tiempoPromedioAtencion": 0,
            "idServicio": 1,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 1,
            "descripcionTurno": "Mañana",
            "color": "lightgreen"
        },
        {
            "id": 5,
            "idProgramacion": 416,
            "horaInicio": "",
            "horaFin": "",
            "dia": 5,
            "diaSemana": "JU",
            "fecha": "20260205",
            "tiempoPromedioAtencion": 0,
            "idServicio": 1,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 1,
            "descripcionTurno": "Mañana",
            "color": "lightgreen"
        },
        {
            "id": 6,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 6,
            "diaSemana": "VI",
            "fecha": "20260206",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 1,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 7,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 7,
            "diaSemana": "SA",
            "fecha": "20260207",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 8,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 8,
            "diaSemana": "DO",
            "fecha": "20260208",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 9,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 9,
            "diaSemana": "LU",
            "fecha": "20260209",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 10,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 10,
            "diaSemana": "MA",
            "fecha": "20260210",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 11,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 11,
            "diaSemana": "MI",
            "fecha": "20260211",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 12,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 12,
            "diaSemana": "JU",
            "fecha": "20260212",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 13,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 13,
            "diaSemana": "VI",
            "fecha": "20260213",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 14,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 14,
            "diaSemana": "SA",
            "fecha": "20260214",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 15,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 15,
            "diaSemana": "DO",
            "fecha": "20260215",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 16,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 16,
            "diaSemana": "LU",
            "fecha": "20260216",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 17,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 17,
            "diaSemana": "MA",
            "fecha": "20260217",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 18,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 18,
            "diaSemana": "MI",
            "fecha": "20260218",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 19,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 19,
            "diaSemana": "JU",
            "fecha": "20260219",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 20,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 20,
            "diaSemana": "VI",
            "fecha": "20260220",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 21,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 21,
            "diaSemana": "SA",
            "fecha": "20260221",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 22,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 22,
            "diaSemana": "DO",
            "fecha": "20260222",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 23,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 23,
            "diaSemana": "LU",
            "fecha": "20260223",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 24,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 24,
            "diaSemana": "MA",
            "fecha": "20260224",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 25,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 25,
            "diaSemana": "MI",
            "fecha": "20260225",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 26,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 26,
            "diaSemana": "JU",
            "fecha": "20260226",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 27,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 27,
            "diaSemana": "VI",
            "fecha": "20260227",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 28,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 28,
            "diaSemana": "SA",
            "fecha": "20260228",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        }
    ],
    "usuario": "macuna"
}

/**
 * 
 *
     const manejarGuardado = useCallback(async (horarioActualizado = null) => {
         setEstadoGuardado('guardando');
 
         try {
                 const fuenteDeDatos = horarioActualizado || horarioCalendario;
 
                 const diasConTurnos = datosOriginalesBackend.map(dia => {
                     const clave = dia.getClaveCalendario();
                     const seleccion = fuenteDeDatos[clave];
                     const nuevoIdTurno = (seleccion && seleccion[0] !== 'libre') 
                         ? Number(seleccion[0]) 
                         : 0;
                     return actualizarTurnoEnDia(dia, nuevoIdTurno);
                  });
 
             const hoy = new Date();
             const contexto = {
                 fechaActualFormateada: hoy.toLocaleDateString('es-ES', { 
                     day: '2-digit', month: '2-digit', year: 'numeric' 
                 }).replace(/\//g, ''),
                 idEspecialidad: 9, 
                 idServicio: 1,
                 idMedico: 1762,
                 usuario: "macuna"
             };
 
             const payloadFinal = modelarCrearProgramacion(contexto, diasConTurnos);
 ///            console.log("payloadFinal "+JSON.stringify(payloadFinal));
 
             const res =await ProgramacionHorarioIndividualService.crearProgramacionMesUsuario(payloadFinal);
 //            console.log("Devolucion "+JSON.stringify(res));
             setEstadoGuardado('guardado');
             
             // Limpiar el mensaje de éxito después de 3 segundos
             setTimeout(() => setEstadoGuardado(null), 3000);
 
         } catch (error) {
             console.error("Error en manejarGuardado:", error);
             setEstadoGuardado(null);
         }
     }, [horarioCalendario, datosOriginalesBackend]); 
 */