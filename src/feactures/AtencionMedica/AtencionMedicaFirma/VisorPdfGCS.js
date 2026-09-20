import React, { useState } from 'react';
import { PenTool, RefreshCw, UploadCloud } from 'lucide-react';

import { 
  solicitarAccesoCarpetaEntrada, 
  guardarPDFsEnCarpetaEntrada,
  solicitarAccesoCarpetaSalida,
  leerPDFsDeCarpetaSalida
} from '../../FirmaDigital/hooks/useFileSystemRefirma';

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
  const [dirHandleEntrada, setDirHandleEntrada] = useState(null);
  const [dirHandleSalida, setDirHandleSalida] = useState(null);
  const [procesandoFirma, setProcesandoFirma] = useState(false);
  const [cargandoSalida, setCargandoSalida] = useState(false);
  const [progreso, setProgreso] = useState(0);

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

  const handleEjecutarFirmaCompleta = async () => {
    let handleActual = dirHandleEntrada;

    if (!handleActual) {
      handleActual = await solicitarAccesoCarpetaEntrada();
      if (!handleActual) {
        showModalMessage?.("Debes seleccionar la carpeta de ENTRADA de ReFirma (ej. C:\\igm_salud\\refirma\\entrada) para continuar.");
        return;
      }
      setDirHandleEntrada(handleActual);
    }

    try {
      setProcesandoFirma(true);
      setProgreso(0);

      const idAtencion = atencionData?.idAtencion || atencionData?.id || 'atencion';

      const urlHc = documentosPdf?.hc?.urlLectura || documentosPdf?.urlHistoriaPdf;
      const urlReceta = documentosPdf?.receta?.urlLectura || documentosPdf?.urlRecetaPdf;
      const urlOrdenes = documentosPdf?.ordenes?.urlLectura || documentosPdf?.urlOrdenesPdf;
      const urlIndicaciones = documentosPdf?.indicaciones?.urlLectura || documentosPdf?.urlIndicacionesPdf;

      const loteDocumentos = [
        { 
          id: `${idAtencion}_hc`, 
          urlPdfBorrador: urlHc, 
          nombreArchivo: documentosPdf?.hc?.nombreArchivo || `atencion_${idAtencion}_historia-borrador.pdf` 
        },
        { 
          id: `${idAtencion}_receta`, 
          urlPdfBorrador: urlReceta, 
          nombreArchivo: documentosPdf?.receta?.nombreArchivo || `atencion_${idAtencion}_receta-borrador.pdf` 
        },
        { 
          id: `${idAtencion}_ordenes`, 
          urlPdfBorrador: urlOrdenes, 
          nombreArchivo: documentosPdf?.ordenes?.nombreArchivo || `atencion_${idAtencion}_orden-borrador.pdf` 
        },
        { 
          id: `${idAtencion}_indicaciones`, 
          urlPdfBorrador: urlIndicaciones, 
          nombreArchivo: documentosPdf?.indicaciones?.nombreArchivo || `atencion_${idAtencion}_indicaciones-borrador.pdf` 
        }
      ].filter(doc => Boolean(doc.urlPdfBorrador));

      if (loteDocumentos.length === 0) {
        showModalMessage?.("No se encontraron URLs válidas de PDF en el lote para firmar.");
        return;
      }

      await guardarPDFsEnCarpetaEntrada(handleActual, loteDocumentos, (porcentaje) => {
        setProgreso(porcentaje);
      });

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

  const handleCargarFirmadosSalida = async () => {
    let handleSalidaActual = dirHandleSalida;

    if (!handleSalidaActual) {
      handleSalidaActual = await solicitarAccesoCarpetaSalida();
      if (!handleSalidaActual) {
        showModalMessage?.("Debes seleccionar la carpeta de SALIDA de ReFirma (ej. C:\\igm_salud\\refirma\\salida) para procesar los firmados.");
        return;
      }
      setDirHandleSalida(handleSalidaActual);
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
      } else {
        showModalMessage?.("Se leyeron los archivos pero no hay una función de carga registrada.");
      }
    } catch (error) {
      console.error("Error al leer la carpeta de salida:", error);
      showModalMessage?.("Error al leer los documentos firmados de la carpeta de salida.");
    } finally {
      setCargandoSalida(false);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '650px' }}>
      <div 
        style={{ 
          backgroundColor: '#0f172a', 
          color: '#ffffff', 
          padding: '8px 16px', 
          borderTopRightRadius: '8px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}
      >
        <span style={{ fontWeight: '700', fontSize: '13px', color: '#38bdf8' }}>
          {titulo}
        </span>

        {esPendiente && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleEjecutarFirmaCompleta}
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
              title="1. Descargar lote a la carpeta de entrada y ejecutar ReFirma PC"
            >
              <PenTool size={14} /> 
              {procesandoFirma ? `Guardando lote (${progreso}%)...` : '1. FIRMAR CON REFIRMA'}
            </button>

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
              title="2. Procesar y guardar documentos firmados desde la carpeta de salida"
            >
              <UploadCloud size={14} /> 
              {cargandoSalida ? 'Procesando firmados...' : '2. CARGAR FIRMADOS'}
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