import React, { useState } from 'react';

/**
 * ENTIDAD DE NEGOCIO (Frontend)
 * Este es el contrato que mis componentes de React esperan.
 * No importa si el backend cambia el nombre de la columna,
 * solo cambio el mapper y la UI sigue funcionando.
 */

const PacienteMapper = {
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