import React, { useState } from 'react';
import { RefreshCw, UploadCloud, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';

import { 
  solicitarAccesoCarpetaEntrada, 
  guardarPDFsEnCarpetaEntrada,
  solicitarAccesoCarpetaSalida,
  leerPDFsDeCarpetaSalida
} from '../../FirmaDigital/hooks/useFileSystemRefirma';

const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  const isMacTouch = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

  return mobileRegex.test(userAgent) || isMacTouch;
};

export function VisorPdfGCS({ 
  urlPdfFirmado, 
  titulo = "Atención de Consulta Externa (HC)",
  estadoFirma,
  atencionData,
  documentosPdf = {},
  onInvocarReFirma,
  onProcesarFirmadosSalida,
  onRefrescarEstadoFirma,
  showModalMessage
}) {
  const { dirEntrada, dirSalida, setDirEntrada, setDirSalida } = useAuth();

  const [procesandoFirma, setProcesandoFirma] = useState(false);
  const [cargandoSalida, setCargandoSalida] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [errorMovil, setErrorMovil] = useState(false);
  const baseUrl = process.env.REACT_APP_URL_ARCHIVOS || '';

  const obtenerUrlCompleta = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return `${path}#toolbar=0&navpanes=0`;
    }

    const pathLimpia = path.startsWith('/') ? path.substring(1) : path;
    const baseLimpia = baseUrl.endsWith('/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl;
    return `${baseLimpia}/${pathLimpia}#toolbar=0&navpanes=0`;
  };

  const urlAbsoluta = obtenerUrlCompleta(urlPdfFirmado);

  const estadoUpper = (estadoFirma || '').toUpperCase();
  const esPendiente = estadoUpper === 'PENDIENTE_FIRMA' || estadoUpper === 'PDF_BORRADOR';

  // Flujo Unificado: Prepara la carpeta, limpia, copia el lote e invoca ReFirma automáticamente
  const handleEjecutarPreparacionYFirma = async () => {
    if (isMobileDevice()) {
      setErrorMovil(true);
      showModalMessage?.("Este proceso solo se realiza en equipos de escritorio.");
      return;
    }
    setErrorMovil(false);
    
    if (procesandoFirma) return;

    let handleActual = dirEntrada;

    if (!handleActual) {
      handleActual = await solicitarAccesoCarpetaEntrada();
      if (!handleActual) {
        showModalMessage?.("Debes seleccionar la carpeta de ENTRADA de ReFirma para continuar.");
        return;
      }
      setDirEntrada(handleActual);
    }

    try {
      setProcesandoFirma(true);
      setProgreso(0);

      const idAtencion = atencionData?.idAtencion || atencionData?.id || 'atencion';

      const urlHc = documentosPdf?.hc?.urlLecturaBorrador || documentosPdf?.hc?.urlLectura || documentosPdf?.urlHistoriaPdf;
      const urlReceta = documentosPdf?.receta?.urlLecturaBorrador || documentosPdf?.receta?.urlLectura || documentosPdf?.urlRecetaPdf;
      const urlOrdenes = documentosPdf?.ordenes?.urlLecturaBorrador || documentosPdf?.ordenes?.urlLectura || documentosPdf?.urlOrdenesPdf;
      const urlIndicaciones = documentosPdf?.indicaciones?.urlLecturaBorrador || documentosPdf?.indicaciones?.urlLectura || documentosPdf?.urlIndicacionesPdf;

      const loteDocumentos = [
        { id: `${idAtencion}_hc`, urlPdfBorrador: urlHc, nombreArchivo: documentosPdf?.hc?.nombreArchivo || `atencion_${idAtencion}_historia-borrador.pdf` },
        { id: `${idAtencion}_receta`, urlPdfBorrador: urlReceta, nombreArchivo: documentosPdf?.receta?.nombreArchivo || `atencion_${idAtencion}_receta-borrador.pdf` },
        { id: `${idAtencion}_ordenes`, urlPdfBorrador: urlOrdenes, nombreArchivo: documentosPdf?.ordenes?.nombreArchivo || `atencion_${idAtencion}_orden-borrador.pdf` },
        { id: `${idAtencion}_indicaciones`, urlPdfBorrador: urlIndicaciones, nombreArchivo: documentosPdf?.indicaciones?.nombreArchivo || `atencion_${idAtencion}_indicaciones-borrador.pdf` }
      ].filter(doc => Boolean(doc.urlPdfBorrador));

      if (loteDocumentos.length === 0) {
        showModalMessage?.("No se encontraron URLs válidas de PDF en el lote para firmar.");
        return;
      }

      // 1. Limpia y copia los PDFs nuevos a la carpeta de entrada local
      await guardarPDFsEnCarpetaEntrada(handleActual, loteDocumentos, (porcentaje) => {
        setProgreso(porcentaje);
      });

      // 2. Invoca automáticamente ReFirma
      if (typeof onInvocarReFirma === 'function') {
        onInvocarReFirma();
      }

    } catch (error) {
      console.error("Error al procesar la firma en lote:", error);
      showModalMessage?.("Error al guardar los archivos en la carpeta de entrada o ejecutar ReFirma.");
    } finally {
      setProcesandoFirma(false);
    }
  };

  // Cargar firmados desde la carpeta de salida
  const handleCargarFirmadosSalida = async () => {
    if (isMobileDevice()) {
      showModalMessage?.("Este proceso solo se realiza en equipos de escritorio.");
      return;
    }

    let handleSalidaActual = dirSalida;

    if (!handleSalidaActual) {
      handleSalidaActual = await solicitarAccesoCarpetaSalida();
      if (!handleSalidaActual) {
        showModalMessage?.("Debes seleccionar la carpeta de SALIDA de ReFirma para procesar los firmados.");
        return;
      }
      setDirSalida(handleSalidaActual);
    }

    try {
      setCargandoSalida(true);
      const archivosFirmados = await leerPDFsDeCarpetaSalida(handleSalidaActual);

      if (!archivosFirmados || archivosFirmados.length === 0) {
        showModalMessage?.("No se encontraron documentos PDF firmados en la carpeta de salida.");
        return;
      }

      if (typeof onProcesarFirmadosSalida === 'function') {
        await onProcesarFirmadosSalida(archivosFirmados);

        // Limpieza de la carpeta de salida tras una subida exitosa
        for await (const entry of handleSalidaActual.values()) {
          if (entry.kind === 'file') {
            await handleSalidaActual.removeEntry(entry.name);
          }
        }
      } else {
        showModalMessage?.("Se leyeron los archivos pero no hay una función de carga registrada.");
      }
    } catch (error) {
      console.error("Error al leer la carpeta de salida:", error);
      showModalMessage?.("Error al leer o limpiar los documentos firmados de la carpeta de salida.");
    } finally {
      setCargandoSalida(false);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '650px' }}>

      {errorMovil && (
        <div style={{ backgroundColor: '#fef3c7', borderBottom: '1px solid #f59e0b', color: '#92400e', padding: '8px 16px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={16} color="#d97706" />
          <span>Este proceso solo se realiza en equipos de escritorio.</span>
        </div>
      )}

      <div style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '8px 16px', borderTopRightRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: '700', fontSize: '13px', color: '#38bdf8' }}>
          {titulo}
        </span>

        {esPendiente && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            
            {/* Único botón de Preparación y Lanzamiento Automático */}
            <button
              type="button"
              onClick={handleEjecutarPreparacionYFirma}
              disabled={procesandoFirma || cargandoSalida}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: procesandoFirma ? '#94a3b8' : '#16a34a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: (procesandoFirma || cargandoSalida) ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 4px rgba(22, 163, 74, 0.3)'
              }}
              title="Preparar lote y abrir ReFirma"
            >
              <UploadCloud size={14} /> 
              {procesandoFirma ? `Preparando lote (${progreso}%)...` : 'PREPARAR Y FIRMAR'}
            </button>

            {/* Botón para procesar los documentos ya firmados de la salida */}
            <button
              type="button"
              onClick={handleCargarFirmadosSalida}
              disabled={procesandoFirma || cargandoSalida}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: cargandoSalida ? '#94a3b8' : '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: (procesandoFirma || cargandoSalida) ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 4px rgba(2, 132, 199, 0.3)'
              }}
              title="Procesar documentos firmados desde la carpeta de salida"
            >
              <UploadCloud size={14} /> 
              {cargandoSalida ? 'Procesando firmados...' : 'CARGAR FIRMADOS'}
            </button>

            {onRefrescarEstadoFirma && (
              <button
                type="button"
                onClick={onRefrescarEstadoFirma}
                disabled={procesandoFirma || cargandoSalida}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: '#1e293b',
                  color: '#94a3b8',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  cursor: (procesandoFirma || cargandoSalida) ? 'not-allowed' : 'pointer'
                }}
                title="Refrescar estado de firma"
              >
                <RefreshCw size={13} />
              </button>
            )}
          </div>
        )}
      </div>

      <div style={{ flex: 1, backgroundColor: '#f1f5f9', padding: '12px', display: 'flex', justifyContent: 'center' }}>
        {!urlAbsoluta ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            No hay documento PDF disponible para previsualizar.
          </div>
        ) : (
          <iframe
            key={urlAbsoluta}
            src={urlAbsoluta}
            width="100%"
            height="100%"
            title={titulo}
            style={{
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
        )}
      </div>
    </div>
  );
}

export default VisorPdfGCS;