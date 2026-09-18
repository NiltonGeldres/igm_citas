import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

import { ResumenClinicoBorradorCard } from './ResumenClinicoBorradorCard';
import { VisorPdfGCS } from './VisorPdfGCS';
import { BarraHerramientasFirma } from './BarraHerramientasFirma';

export function AtencionMedicaFirmaPanelV1({
  sectionsData = {},
  attentionDetails = {},
  crearPdfBorrador,
  showModalMessage,
  estadoFirma = "BORRADOR",
  jsonFirmadoUrl = null,
  rutaPdfFirmado = null,
  documentosPdf = {},
  onRefrescarEstadoFirma
}) {
  const [loadingFirma, setLoadingFirma] = useState(false);
  const [vistaDocumento, setVistaDocumento] = useState('hc');

  const sourceDetails = Object.keys(attentionDetails).length > 0 ? attentionDetails : sectionsData;

  const handleGenerarPdfAccion = async () => {
    if (typeof crearPdfBorrador !== 'function') {
      showModalMessage?.("Error: La función crearPdfBorrador no está conectada.");
      return;
    }
    try {
      setLoadingFirma(true);
      await crearPdfBorrador();
    } catch (error) {
      showModalMessage?.("Error al procesar la preparación del PDF.");
    } finally {
      setLoadingFirma(false);
    }
  };

  // Función para invocar el protocolo ReFirma
  const handleInvocarReFirma = () => {
    if (jsonFirmadoUrl) {
      const refirmaUrl = jsonFirmadoUrl.startsWith('refirma://')
        ? jsonFirmadoUrl
        : `refirma://?getArguments=${encodeURIComponent(jsonFirmadoUrl)}`;
      window.location.href = refirmaUrl;
    } else {
      // Si no hay jsonFirmadoUrl específico, abre el esquema nativo de ReFirma
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = 'refirma://abrir';
      document.body.appendChild(iframe);
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }
  };

  const obtenerUrlSegunVista = () => {
    switch (vistaDocumento) {
      case 'hc': return documentosPdf?.hc?.url;
      case 'receta': return documentosPdf?.receta?.url;
      case 'ordenes': return documentosPdf?.ordenes?.url;
      case 'indicaciones': return documentosPdf?.indicaciones?.url;
      default: return rutaPdfFirmado || documentosPdf?.hc?.url;      
    }
  };

  const TITULOS_DOCUMENTO = {
    hc: 'Atención de Consulta Externa (HC)',
    receta: 'Receta Médica Electrónica',
    ordenes: 'Órdenes de Exámenes / Procedimientos',
    indicaciones: 'Indicaciones Médicas'
  };

  const urlPdfActual = obtenerUrlSegunVista();

  // Función requerida por VisorPdfGCS para subir los PDFs firmados desde C:\igm_salud\refirma\salida
    const handleProcesarFirmadosSalida = async (archivosFirmados) => {
      console.log("FIRMADOS: ", archivosFirmados);
      try {
        const idAtencion = sourceDetails?.idAtencion || sourceDetails?.id || sourceDetails?.id_atencion;
        const idStr = idAtencion ? String(idAtencion) : '';

        // 1. URLs Presigned PUT para subida a Cloudflare R2
        const mapaPutUrls = {
          hc: documentosPdf?.hc?.urlEscrituraSigned || documentosPdf?.hc?.urlEscrituraBorrador || documentosPdf?.hc?.url,
          receta: documentosPdf?.receta?.urlEscrituraSigned || documentosPdf?.receta?.urlEscrituraBorrador || documentosPdf?.receta?.url,
          ordenes: documentosPdf?.ordenes?.urlEscrituraSigned || documentosPdf?.ordenes?.urlEscrituraBorrador || documentosPdf?.ordenes?.url,
          indicaciones: documentosPdf?.indicaciones?.urlEscrituraSigned || documentosPdf?.indicaciones?.urlEscrituraBorrador || documentosPdf?.indicaciones?.url
        };

        // 2. Nombres exactos recibidos desde el backend/prop
        const mapaNombresBackend = {
          hc: (documentosPdf?.hc?.nombreArchivo || '').toLowerCase().replace('.pdf', ''),
          receta: (documentosPdf?.receta?.nombreArchivo || '').toLowerCase().replace('.pdf', ''),
          ordenes: (documentosPdf?.ordenes?.nombreArchivo || '').toLowerCase().replace('.pdf', ''),
          indicaciones: (documentosPdf?.indicaciones?.nombreArchivo || '').toLowerCase().replace('.pdf', '')
        };

        let subidosExitosos = 0;

        for (const item of archivosFirmados) {
          const nombreLeido = (item.nombreArchivo || '').toLowerCase();
          let urlPutDestino = null;

          // Evaluación limpia con paréntesis corregidos
          if (
            (mapaNombresBackend.hc && nombreLeido.includes(mapaNombresBackend.hc)) ||
            (idStr && nombreLeido.includes(idStr) && (nombreLeido.includes('historia') || nombreLeido.includes('hc')))
          ) {
            urlPutDestino = mapaPutUrls.hc;
          } else if (
            (mapaNombresBackend.receta && nombreLeido.includes(mapaNombresBackend.receta)) ||
            (idStr && nombreLeido.includes(idStr) && nombreLeido.includes('receta'))
          ) {
            urlPutDestino = mapaPutUrls.receta;
          } else if (
            (mapaNombresBackend.ordenes && nombreLeido.includes(mapaNombresBackend.ordenes)) ||
            (idStr && nombreLeido.includes(idStr) && (nombreLeido.includes('orden') || nombreLeido.includes('procedimiento')))
          ) {
            urlPutDestino = mapaPutUrls.ordenes;
          } else if (
            (mapaNombresBackend.indicaciones && nombreLeido.includes(mapaNombresBackend.indicaciones)) ||
            (idStr && nombreLeido.includes(idStr) && (nombreLeido.includes('indicación') || nombreLeido.includes('indicacion')))
          ) {
            urlPutDestino = mapaPutUrls.indicaciones;
          }

          console.log(`Evaluado: ${nombreLeido} -> URL PUT: ${urlPutDestino}`);

          if (urlPutDestino) {
            console.log(`Subiendo a Cloudflare R2: ${item.nombreArchivo}...`);

            // Extraer contenido real binario (Blob o File)
            const archivoPayload = item.blob instanceof Blob ? item.blob : (item.file instanceof File ? item.file : item.blob);

            const res = await fetch(urlPutDestino, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/pdf' },
              body: archivoPayload
            });

            if (res.ok) {
              subidosExitosos++;
            } else {
              console.error(`Error HTTP al subir ${item.nombreArchivo}: Status ${res.status}`);
            }
          } else {
            console.warn(`No se encontró coincidencia para: ${item.nombreArchivo}`);
          }
        }

        if (subidosExitosos > 0) {
          showModalMessage?.(`¡Se subieron ${subidosExitosos} documento(s) correctamente a R2!`);
          if (typeof onRefrescarEstadoFirma === 'function') {
            onRefrescarEstadoFirma();
          }
        } else {
          showModalMessage?.("No se encontraron coincidencias entre los archivos leídos y los documentos de esta atención.");
        }

      } catch (error) {
        console.error("Error en la carga de archivos firmados a R2:", error);
        showModalMessage?.("Ocurrió un error al intentar subir los archivos firmados.");
      }
    };

  return (
    <div style={{ width: '100%' }}>
      {estadoFirma === "BORRADOR" ? (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="#0284c7" /> Cierre del Acto Médico y Conformidad
            </h3>
            <span style={{ backgroundColor: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px' }}>
              BORRADOR EN EDICIÓN
            </span>
          </div>

          <ResumenClinicoBorradorCard sourceDetails={sourceDetails} />

          <button
            type="button"
            onClick={handleGenerarPdfAccion}
            disabled={loadingFirma}
            style={{
              width: '100%',
              backgroundColor: loadingFirma ? '#94a3b8' : '#16a34a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '14px',
              fontWeight: '700',
              cursor: loadingFirma ? 'not-allowed' : 'pointer'
            }}
          >
            {loadingFirma ? "Generando borrador PDF..." : "GENERAR PDF BORRADOR"}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
          <BarraHerramientasFirma
            vistaDocumento={vistaDocumento}
            setVistaDocumento={setVistaDocumento}
          />
          <VisorPdfGCS
            urlPdfFirmado={urlPdfActual}
            titulo={TITULOS_DOCUMENTO[vistaDocumento]}
            estadoFirma={estadoFirma}
            atencionData={sourceDetails}
            documentosPdf={documentosPdf}
            onInvocarReFirma={handleInvocarReFirma}
            onProcesarFirmadosSalida={handleProcesarFirmadosSalida}
            onRefrescarEstadoFirma={onRefrescarEstadoFirma}
            showModalMessage={showModalMessage}
          />
        </div>
      )}
    </div>
  );
}

export default AtencionMedicaFirmaPanelV1;