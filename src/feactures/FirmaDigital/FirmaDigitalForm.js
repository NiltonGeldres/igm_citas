import { useState, useEffect } from 'react';
import { BarraPasosFirma } from './components/BarraPasosFirma';
import { ListaAtencionesLote } from './components/ListaAtencionesLote';
import { VisorDocumentoFirma } from './components/VisorDocumentoFirma';
import './styles/firma-digital.css';
import FirmaDigitalService from './FirmaDigitalService';

// ============================================================================
// FUNCIONES AUXILIARES DE ESCRITURA DIRECTA EN DISCO (File System Access API)
// ============================================================================

/**
 * Solicita acceso a la carpeta C:\igm_salud\refirma\entrada en el disco local
 */
const solicitarAccesoCarpetaEntrada = async () => {
  try {
    if (!('showDirectoryPicker' in window)) {
      alert("Tu navegador no soporta File System Access API. Por favor usa Google Chrome o Microsoft Edge.");
      return null;
    }

    const dirHandle = await window.showDirectoryPicker({
      mode: 'readwrite',
      id: 'refirma_entrada_folder'
    });

    return dirHandle;
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error("Error al seleccionar la carpeta de entrada:", error);
    }
    return null;
  }
};

/**
 * Descarga los PDFs desde R2 y los escribe directamente en la carpeta física seleccionada
 */
const guardarPDFsEnCarpetaEntrada = async (dirHandle, atencionesSeleccionadas, onProgreso) => {
  const total = atencionesSeleccionadas.length;
  
  for (let index = 0; index < total; index++) {
    const item = atencionesSeleccionadas[index];
    const urlPresigned = item.rutaPdfFirmado || item.urlPdfBorrador || item.rutaPdfBorrador;

    if (!urlPresigned || !urlPresigned.startsWith('http')) {
      console.error(`Atención ID ${item.idAtencion || item.id} sin URL válida.`);
      continue;
    }

    // 1. Descargar binario del PDF desde la URL
    const respuesta = await fetch(urlPresigned, { method: 'GET', mode: 'cors' });
    if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status} al descargar PDF`);
    const blob = await respuesta.blob();

    // 2. Definir nombre de archivo
    const idAtencion = item.idAtencion || item.id;
    const nombreArchivo = item.nombreArchivo || `atencion_${idAtencion}_borrador.pdf`;

    // 3. Escribir archivo directamente en el disco duro local
    const fileHandle = await dirHandle.getFileHandle(nombreArchivo, { create: true });
    const writableStream = await fileHandle.createWritable();
    await writableStream.write(blob);
    await writableStream.close();

    // Reportar porcentaje de avance
    if (onProgreso) {
      const porcentaje = Math.round(((index + 1) / total) * 100);
      onProgreso(porcentaje);
    }
  }
  return true;
};

/**
 * Invocación por protocolo URI personalizado refirma://abrir
 */
export const invocarReFirmaURI = () => {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'refirma://abrir';
  document.body.appendChild(iframe);
  setTimeout(() => {
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  }, 2000);
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

function FirmaDigitalForm() {
  const [pasoActual, setPasoActual] = useState(1);
  const [atenciones, setAtenciones] = useState([]);
  const [atencionSeleccionada, setAtencionSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [descargando, setDescargando] = useState(false);
  
  // Guardamos la referencia de la carpeta C:\igm_salud\refirma\entrada
  const [dirEntradaHandle, setDirEntradaHandle] = useState(null);

  const ID_MEDICO_LOGUEADO = 2;

  useEffect(() => {
    const obtenerPendientes = async () => {
      try {
        setCargando(true);
        setError(null);
        
        const data = await FirmaDigitalService.listarPendientesFirma(ID_MEDICO_LOGUEADO);
        console.log("PENDIENTES dDE FIRMAR "+ JSON.stringify(data))
        const atencionesMapeadas = data.map((item) => ({
          id: item.idAtencion,
          pacienteNombre: item.nombrePaciente,
          dni: item.hc,
          nombreArchivo: item.nombreArchivo || `atencion_${item.idAtencion}_${ID_MEDICO_LOGUEADO}.pdf`,
          estado: item.estadoFirma || 'PENDIENTE',
          seleccionado: true,
          fecha: new Date(item.fechaAtencion).toLocaleDateString('es-PE'),
          especialidad: item.nombreEspecialidad,
          servicio: item.nombreServicio,
          rutaPdfFirmado: item.rutaPdfFirmado,
          urlPdfBorrador: item.urlPdfBorrador || item.rutaPdfBorrador,
          hashFirmaDigital: item.hashFirmaDigital
        }));

        setAtenciones(atencionesMapeadas);
        if (atencionesMapeadas.length > 0) {
          setAtencionSeleccionada(atencionesMapeadas[0]);
        }
      } catch (err) {
        console.error('Error al cargar atenciones pendientes:', err);
        setError('No se pudieron obtener las atenciones pendientes de firma.');
      } finally {
        setCargando(false);
      }
    };

    obtenerPendientes();
  }, []);

  // Función principal del botón del paso
  const manejarAccionPaso = async () => {
    if (pasoActual === 1) {
      const atencionesAProcesar = atenciones.filter(a => a.seleccionado);
      
      if (atencionesAProcesar.length === 0) {
        alert("Seleccione al menos una atención para procesar.");
        return;
      }

      let handleActual = dirEntradaHandle;

      // 1. Abrir explorador de archivos inmediatamente al hacer clic
      if (!handleActual) {
        handleActual = await solicitarAccesoCarpetaEntrada();
        if (!handleActual) {
          return; // El usuario canceló la selección de carpeta
        }
        setDirEntradaHandle(handleActual);
      }

      try {
        setDescargando(true);

        // 2. Escribir directamente los archivos PDF descargados de R2 en la carpeta física
        const exito = await guardarPDFsEnCarpetaEntrada(handleActual, atencionesAProcesar, (progreso) => {
          console.log(`Escribiendo en disco: ${progreso}%`);
        });

        if (exito) {
          setAtenciones(prev => prev.map(a => ({ ...a, estado: 'DESCARGADO' })));

          // 3. Abrir ReFirma PC de forma transparente
          invocarReFirmaURI();

          // 4. Avanzar al Paso 2
          setPasoActual(2);
        }
      } catch (err) {
        console.error("Error al escribir archivos en disco o invocar ReFirma:", err);
        alert("Ocurrió un error al guardar los archivos en la carpeta de entrada de ReFirma.");
      } finally {
        setDescargando(false);
      }

    } else if (pasoActual === 2) {
      // Lógica para el paso 2: Cargar firmados
      setAtenciones(prev => prev.map(a => ({ ...a, estado: 'FIRMADO' })));
      setPasoActual(3);

    } else if (pasoActual === 3) {
      alert('¡Lote consolidado exitosamente en Cloudflare R2 y BD Neon!');
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', color: '#f8fafc', minHeight: '100vh', padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #1e293b' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#38bdf8', margin: 0 }}>
            Módulo de Firma Digital - PASO {pasoActual}
          </h1>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
            {pasoActual === 1 && 'Escritura directa en disco (C:\\igm_salud\\refirma\\entrada) e Invocación a ReFirma'}
            {pasoActual === 2 && 'Ejecución de ReFirma PC y Lectura de archivos firmados en C:\\igm_salud\\refirma\\salida'}
            {pasoActual === 3 && 'Confirmación de Guardado, Almacenamiento en R2 y Purga de Borradores'}
          </p>
        </div>
        <div style={{ backgroundColor: '#082f49', border: '1px solid #0369a1', color: '#bae6fd', padding: '6px 16px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600' }}>
          Dr. Nilton Geldres | CMP: 85421
        </div>
      </div>

      <BarraPasosFirma pasoActual={pasoActual} alSeleccionarPaso={setPasoActual} />

      {cargando ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#38bdf8' }}>
          Cargando atenciones pendientes de firma desde la base de datos...
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '24px', color: '#f87171', backgroundColor: '#450a0a', borderRadius: '8px', border: '1px solid #991b1b' }}>
          {error}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', width: '100%', alignItems: 'stretch', boxSizing: 'border-box' }}>
          <div style={{ width: '220px', minWidth: '220px', flexShrink: 0 }}>
            <ListaAtencionesLote
              pasoActual={pasoActual}
              atenciones={atenciones}
              atencionSeleccionada={atencionSeleccionada}
              alSeleccionarAtencion={setAtencionSeleccionada}
              alAccionarBotonPaso={manejarAccionPaso}
              cargando={descargando}
            />
          </div>

          <div style={{ flex: '1 1 0%', minWidth: 0 }}>
            <VisorDocumentoFirma pasoActual={pasoActual} atencion={atencionSeleccionada} />
          </div>
        </div>
      )}
    </div>
  );
}

export default FirmaDigitalForm;

/*import { useState, useEffect } from 'react';
import { BarraPasosFirma } from './components/BarraPasosFirma';
import { ListaAtencionesLote } from './components/ListaAtencionesLote';
import { VisorDocumentoFirma } from './components/VisorDocumentoFirma';
import './styles/firma-digital.css';
import FirmaDigitalService from './FirmaDigitalService';
import { procesarYDescargarLotePDFs} from './hooks/procesarYDescargarLotePDFs';


function FirmaDigitalForm() {
  const [pasoActual, setPasoActual] = useState(1);
  const [atenciones, setAtenciones] = useState([]);
  const [atencionSeleccionada, setAtencionSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [descargando, setDescargando] = useState(false); // Estado para feedback de carga

  const ID_MEDICO_LOGUEADO = 2;

  useEffect(() => {
    const obtenerPendientes = async () => {
      try {
        setCargando(true);
        setError(null);
        
        const data = await FirmaDigitalService.listarPendientesFirma(ID_MEDICO_LOGUEADO);
        const atencionesMapeadas = data.map((item) => ({
          id: item.idAtencion,
          pacienteNombre: item.nombrePaciente,
          dni: item.hc,
          nombreArchivo: item.nombreArchivo || `atencion_${item.idAtencion}_${ID_MEDICO_LOGUEADO}.pdf`,
          estado: item.estadoFirma || 'PENDIENTE',
          seleccionado: true,
          fecha: new Date(item.fechaAtencion).toLocaleDateString('es-PE'),
          especialidad: item.nombreEspecialidad,
          servicio: item.nombreServicio,
          rutaPdfFirmado: item.rutaPdfFirmado,
          urlPdfBorrador: item.urlPdfBorrador || item.rutaPdfBorrador, // URL firmada de R2
          hashFirmaDigital: item.hashFirmaDigital
        }));

        setAtenciones(atencionesMapeadas);
        if (atencionesMapeadas.length > 0) {
          setAtencionSeleccionada(atencionesMapeadas[0]);
        }
      } catch (err) {
        console.error('Error al cargar atenciones pendientes:', err);
        setError('No se pudieron obtener las atenciones pendientes de firma.');
      } finally {
        setCargando(false);
      }
    };

    obtenerPendientes();
  }, []);

  // 2. CONECTAR LA DESCARGA ZIP EN EL PASO 1
// En FirmaDigitalForm.jsx

const manejarAccionPaso = async () => {
  if (pasoActual === 1) {
    const atencionesAProcesar = atenciones.filter(a => a.seleccionado);
    
    if (atencionesAProcesar.length === 0) {
      alert("Seleccione al menos una atención para descargar.");
      return;
    }

    try {
      setDescargando(true);
      
      // 1 y 2. Descargar PDFs directamente a la carpeta local
      const exito = await procesarYDescargarLotePDFs(atencionesAProcesar, (progreso) => {
        console.log(`Progreso de descarga: ${progreso}%`);
      });

      if (exito) {
        setAtenciones(prev => prev.map(a => ({ ...a, estado: 'DESCARGADO' })));
        
        // 3. Invocar a ReFirma PC usando el protocolo URI
        setTimeout(() => {
          window.location.href = "refirma://abrir";
        }, 1000);

        // Avanzar al Paso 2
        setPasoActual(2);
      }
    } catch (err) {
      console.error("Error al procesar la descarga e invocación:", err);
    } finally {
      setDescargando(false);
    }

  } else if (pasoActual === 2) {
    // Lógica para importar/cargar los firmados desde C:\igm_salud\refirma\salida
    setAtenciones(prev => prev.map(a => ({ ...a, estado: 'FIRMADO' })));
    setPasoActual(3);

  } else if (pasoActual === 3) {
    alert('¡Lote consolidado exitosamente en Cloudflare R2 y BD Neon!');
  }
};

  return (
    <div style={{ backgroundColor: '#f8fafc', color: '#f8fafc', minHeight: '100vh', padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #1e293b' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#38bdf8', margin: 0 }}>
            Módulo de Firma Digital - PASO {pasoActual}
          </h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
              {pasoActual === 1 && 'Descarga de PDFs a Carpeta Local (C:\\igm_salud\\refirma\\entrada)'}
              {pasoActual === 2 && 'Ejecución de ReFirma PC y Lectura desde C:\\igm_salud\\refirma\\salida'}
              {pasoActual === 3 && 'Confirmación de Guardado, Almacenamiento en R2 y Purga de Borradores'}
            </p>
        </div>
        <div style={{ backgroundColor: '#082f49', border: '1px solid #0369a1', color: '#bae6fd', padding: '6px 16px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600' }}>
          Dr. Nilton Geldres | CMP: 85421
        </div>
      </div>

      <BarraPasosFirma pasoActual={pasoActual} alSeleccionarPaso={setPasoActual} />

      {cargando ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#38bdf8' }}>
          Cargando atenciones pendientes de firma desde la base de datos...
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '24px', color: '#f87171', backgroundColor: '#450a0a', borderRadius: '8px', border: '1px solid #991b1b' }}>
          {error}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', width: '100%', alignItems: 'stretch', boxSizing: 'border-box' }}>
          <div style={{ width: '220px', minWidth: '220px', flexShrink: 0 }}>
            <ListaAtencionesLote
              pasoActual={pasoActual}
              atenciones={atenciones}
              atencionSeleccionada={atencionSeleccionada}
              alSeleccionarAtencion={setAtencionSeleccionada}
              alAccionarBotonPaso={manejarAccionPaso}
              cargando={descargando} // Pasa estado de descarga al botón
            />
          </div>

          <div style={{ flex: '1 1 0%', minWidth: 0 }}>
            <VisorDocumentoFirma pasoActual={pasoActual} atencion={atencionSeleccionada} />
          </div>
        </div>
      )}
    </div>
  );
}

export default FirmaDigitalForm;*/