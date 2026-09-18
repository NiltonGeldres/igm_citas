import React, { useState } from 'react';

export const CargarFirmadosR2 = ({ 
  atencionData, 
  documentosPdf, 
  onCargaCompleta, 
  showModalMessage 
}) => {
  const [subiendo, setSubiendo] = useState(false);
  const [progresoSubida, setProgresoSubida] = useState(0);

  /**
   * Solicita acceso a la carpeta de salida de ReFirma y sube los archivos firmados a R2
   */
  const handleSeleccionarYSubirCarpetaSalida = async () => {
    try {
      if (!window.showDirectoryPicker) {
        showModalMessage?.("Tu navegador no soporta File System Access API. Utiliza Chrome o Edge.");
        return;
      }

      // 1. Abrir diálogo para seleccionar la carpeta C:\igm_salud\refirma\salida
      const dirSalidaHandle = await window.showDirectoryPicker({
        id: 'refirma_salida',
        startIn: 'documents',
        mode: 'read'
      });

      setSubiendo(true);
      setProgresoSubida(10);

      // 2. Extraer todos los archivos de la carpeta seleccionada
      const archivosFirmadosMap = new Map();
      for await (const entry of dirSalidaHandle.values()) {
        if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.pdf')) {
          const file = await entry.getFile();
          archivosFirmadosMap.set(entry.name, file);
        }
      }

      if (archivosFirmadosMap.size === 0) {
        showModalMessage?.("No se encontraron archivos PDF en la carpeta seleccionada.");
        setSubiendo(false);
        return;
      }

      // 3. Preparar la lista de documentos a subir basándose en los nombres devueltos por el Backend
      const idAtencion = atencionData?.idAtencion || atencionData?.id || 'atencion';
      
      const documentosASubir = [
        {
          nombre: documentosPdf?.hc?.nombreArchivo || `atencion_${idAtencion}_historia-borrador.pdf`,
          urlPut: documentosPdf?.hc?.urlEscrituraSigned // URL presigned PUT provista por el backend
        },
        {
          nombre: documentosPdf?.receta?.nombreArchivo || `atencion_${idAtencion}_receta-borrador.pdf`,
          urlPut: documentosPdf?.receta?.urlEscrituraSigned
        },
        {
          nombre: documentosPdf?.ordenes?.nombreArchivo || `atencion_${idAtencion}_orden-borrador.pdf`,
          urlPut: documentosPdf?.ordenes?.urlEscrituraSigned
        },
        {
          nombre: documentosPdf?.indicaciones?.nombreArchivo || `atencion_${idAtencion}_indicaciones-borrador.pdf`,
          urlPut: documentosPdf?.indicaciones?.urlEscrituraSigned
        }
      ].filter(doc => Boolean(doc.nombre));

      let subidosExitosos = 0;
      const totalDocs = documentosASubir.length;

      // 4. Subir cada archivo a Cloudflare R2 vía HTTP PUT Presigned URL
      for (let i = 0; i < totalDocs; i++) {
        const item = documentosASubir[i];
        const archivoFile = archivosFirmadosMap.get(item.nombre);

        if (archivoFile && item.urlPut) {
          console.log(`Subiendo a R2: ${item.nombre}...`);
          
          const respuestaR2 = await fetch(item.urlPut, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/pdf'
            },
            body: archivoFile
          });

          if (!respuestaR2.ok) {
            throw new Error(`Falló la subida de ${item.nombre} a Cloudflare R2 (HTTP ${respuestaR2.status})`);
          }

          subidosExitosos++;
        } else if (!archivoFile) {
          console.warn(`Archivo no encontrado en carpeta de salida: ${item.nombre}`);
        }

        // Actualizar barra de progreso
        const porcentaje = Math.round(((i + 1) / totalDocs) * 80) + 10;
        setProgresoSubida(porcentaje);
      }

      setProgresoSubida(100);

      if (subidosExitosos > 0) {
        showModalMessage?.(`¡Éxito! Se subieron ${subidosExitosos} documento(s) firmado(s) a Cloudflare R2.`);
        if (typeof onCargaCompleta === 'function') {
          onCargaCompleta({ idAtencion, subidosCount: subidosExitosos });
        }
      } else {
        showModalMessage?.("No se encontraron coincidencias de nombres entre la carpeta de salida y esta atención.");
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log("El usuario canceló la selección de carpeta.");
      } else {
        console.error("Error al subir PDFs firmados a R2:", error);
        showModalMessage?.(`Error durante la carga a Cloudflare R2: ${error.message}`);
      }
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm mt-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Paso 2: Cargar Documentos Firmados a R2
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Selecciona la carpeta <code>C:\igm_salud\refirma\salida</code> para subir automáticamente los PDFs procesados por ReFirma.
      </p>

      {subiendo ? (
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
          <div 
            className="bg-green-600 h-4 rounded-full transition-all duration-300 text-xs text-white text-center font-bold"
            style={{ width: `${progresoSubida}%` }}
          >
            {progresoSubida}%
          </div>
        </div>
      ) : (
        <button
          onClick={handleSeleccionarYSubirCarpetaSalida}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Seleccionar Carpeta de Salida y Subir a Cloudflare R2
        </button>
      )}
    </div>
  );
};