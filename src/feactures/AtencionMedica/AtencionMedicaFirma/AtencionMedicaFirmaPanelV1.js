import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

import { ResumenClinicoBorradorCard } from './ResumenClinicoBorradorCard';
import { VisorPdfGCS } from './VisorPdfGCS';
import { BarraHerramientasFirma } from './BarraHerramientasFirma';
import AtencionMedicaService from '../AtencionMedicaService';
export function AtencionMedicaFirmaPanelV1({
  sectionsData = {},
  patientData = {},
  crearPdfBorrador,
  showModalMessage,
  estadoFirma = "BORRADOR",
  jsonFirmadoUrl = null,
  rutaPdfFirmado = null,
  documentosPdf = {},
  refrescarEstadoFirma
}) {
  const [loadingFirma, setLoadingFirma] = useState(false);
  const [vistaDocumento, setVistaDocumento] = useState('hc');

//  const sourceDetails = Object.keys(attentionDetails).length > 0 ? attentionDetails : sectionsData;
  const sourceDetails = Object.keys(sectionsData).length > 0 ? sectionsData : sectionsData;

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
    alert(JSON.stringify(jsonFirmadoUrl))
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
    const esFirmado = estadoFirma === 'FIRMADO' || estadoFirma === 'FIRMADO_ELECTRONICO';
    const docObj = documentosPdf[vistaDocumento] || {};

    if (esFirmado) {
      return docObj.urlLecturaFirmado || docObj.urlLectura || rutaPdfFirmado;
    }
    return docObj.urlLecturaBorrador || docObj.urlLectura || docObj.urlPdf;
  };
  const TITULOS_DOCUMENTO = {
    hc: 'Atención de Consulta Externa (HC)',
    receta: 'Receta Médica Electrónica',
    ordenes: 'Órdenes de Exámenes / Procedimientos',
    indicaciones: 'Indicaciones Médicas'
  };

  const urlPdfActual = obtenerUrlSegunVista();

  // Función requerida por VisorPdfGCS para subir los PDFs firmados desde C:\igm_salud\refirma\salida
// Función requerida por VisorPdfGCS para subir los PDFs firmados desde C:\igm_salud\refirma\salida
  const handleProcesarFirmadosSalida = async (archivosFirmados) => {
      try {
        const idAtencion = patientData?.idAtencion;
        const idStr = idAtencion ? String(idAtencion) : '';

        // 1. URLs Presigned PUT para subida a Cloudflare R2
        const mapaPutUrls = {
          hc: documentosPdf?.hc?.urlSubidaFirmado,
          receta: documentosPdf?.receta?.urlSubidaFirmado,
          ordenes: documentosPdf?.ordenes?.urlSubidaFirmado,
          indicaciones: documentosPdf?.indicaciones?.urlSubidaFirmado
        };

        // 2. Nombres exactos recibidos desde el backend
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

          if (urlPutDestino) {
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

        // 3. Confirmación con Spring Boot y actualización de estado
        if (subidosExitosos > 0) {
          const payloadConfirmacion = {
            idAtencion: idAtencion,
            observaciones: "Firma digital completada con éxito mediante ReFirma"
          };

          const jsonActualizado = await AtencionMedicaService.confirmarFirma(payloadConfirmacion);
          showModalMessage?.(`¡Se subieron ${subidosExitosos} documento(s) correctamente y se confirmó la firma!`);
          console.log("Validador - refrescarEstadoFirma es:", typeof refrescarEstadoFirma);

              // 🟢 Ejecuta el refresco de estado en la vista padre
            if (typeof refrescarEstadoFirma === 'function') {
              await refrescarEstadoFirma(jsonActualizado);
            } else {
              console.error("⚠️ La prop refrescarEstadoFirma no está definida o no es una función.");
            }
        } else {
          showModalMessage?.("No se encontraron coincidencias entre los archivos leídos y los documentos de esta atención.");
        }

      } catch (error) {
        console.error("Error en la carga o confirmación de archivos firmados:", error);
        showModalMessage?.("Ocurrió un error al intentar subir los archivos o confirmar la firma.");
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
            onRefrescarEstadoFirma={refrescarEstadoFirma}
            showModalMessage={showModalMessage}
          />
        </div>
      )}
    </div>
  );
}

export default AtencionMedicaFirmaPanelV1;
