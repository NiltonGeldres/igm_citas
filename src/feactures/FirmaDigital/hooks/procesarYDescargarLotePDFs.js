// procesarYDescargarLotePDFs.js
export const procesarYDescargarLotePDFs = async (atencionesSeleccionadas, onProgreso) => {
  if (!atencionesSeleccionadas || atencionesSeleccionadas.length === 0) {
    alert("No hay atenciones seleccionadas para descargar.");
    return false;
  }

  let procesados = 0;
  const total = atencionesSeleccionadas.length;

  try {
    for (const item of atencionesSeleccionadas) {
      //const urlPresigned = item.rutaPdfFirmado || item.urlPdfBorrador || item.rutaPdfBorrador;
      const urlPresigned =  item.urlPdfBorrador || item.rutaPdfBorrador ||  item.rutaPdfFirmado;
     if (!urlPresigned || !urlPresigned.startsWith('http')) {
        console.error(`Atención ID ${item.idAtencion || item.id} sin URL válida.`);
        continue;
      }

      // 1. Descargar el Blob
      const respuesta = await fetch(urlPresigned, { method: 'GET', mode: 'cors' });
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

      const blob = await respuesta.blob();
      const idAtencion = item.idAtencion || item.id;
      const nombreArchivo = item.nombreArchivo || `atencion_${idAtencion}_borrador.pdf`;

      // 2. Disparar guardado mediante Blob URL nativo
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Pequeña pausa para permitir que el navegador libere el recurso en disco
      await new Promise(resolve => setTimeout(resolve, 300));
      window.URL.revokeObjectURL(blobUrl);

      procesados++;
      if (onProgreso) {
        onProgreso(Math.round((procesados / total) * 100));
      }
    }

    return true;

  } catch (error) {
    console.error("Error al descargar los archivos desde Cloudflare R2:", error);
    alert("Ocurrió un error al descargar los archivos. Revisa la consola o los permisos CORS.");
    return false;
  }
};