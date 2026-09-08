import { useState, useEffect } from 'react';
import { BarraPasosFirma } from './components/BarraPasosFirma';
import { ListaAtencionesLote } from './components/ListaAtencionesLote';
import { VisorDocumentoFirma } from './components/VisorDocumentoFirma';
import './styles/firma-digital.css';
import FirmaDigitalService from './FirmaDigitalService';

import { procesarYDescargarLoteZip } from './hooks/procesarYDescargarLoteZip';
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
  const manejarAccionPaso = async () => {
    if (pasoActual === 1) {
      const atencionesAProcesar = atenciones.filter(a => a.seleccionado);
      
      if (atencionesAProcesar.length === 0) {
        alert("Seleccione al menos una atención para descargar.");
        return;
      }

      try {
        setDescargando(true);
        // Descarga el lote ZIP desde R2
        const exito = await procesarYDescargarLoteZip(atencionesAProcesar, (progreso) => {
          console.log(`Progreso de descarga: ${progreso}%`);
        });

        if (exito) {
          setAtenciones(prev => prev.map(a => ({ ...a, estado: 'DESCARGADO' })));
          setPasoActual(2); // Avanza al Paso 2
        }
      } catch (err) {
        console.error("Error al descargar el lote ZIP:", err);
      } finally {
        setDescargando(false);
      }

    } else if (pasoActual === 2) {
      // Lógica para importar/cargar los firmados desde C:\IGM_Salud\ReFirma\Salida
      setAtenciones(prev => prev.map(a => ({ ...a, estado: 'FIRMADO' })));
      setPasoActual(3);

    } else if (pasoActual === 3) {
      alert('¡Lote consolidado exitosamente en Cloudflare R2 y BD Neon!');
    }
  };

  return (
    <div style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #1e293b' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#38bdf8', margin: 0 }}>
            Módulo de Firma Digital - PASO {pasoActual}
          </h1>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
            {pasoActual === 1 && 'Descarga de PDFs a Carpeta Local (C:\\IGM_Salud\\ReFirma\\Entrada)'}
            {pasoActual === 2 && 'Ejecución de ReFirma PC y Visualización Exclusiva de Firmados'}
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

export default FirmaDigitalForm;