import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const procesarYDescargarLoteZip = async (atencionesSeleccionadas, onProgreso) => {
  if (!atencionesSeleccionadas || atencionesSeleccionadas.length === 0) {
    alert("No hay atenciones seleccionadas para descargar.");
    return false;
  }

  const zip = new JSZip();
  let procesados = 0;
  const total = atencionesSeleccionadas.length;

  try {
    const descargas = atencionesSeleccionadas.map(async (item) => {
      // 1. Extraer la Pre-Signed URL del JSON retornado por Spring Boot
      const urlPresigned = item.rutaPdfFirmado || item.urlPdfBorrador || item.rutaPdfBorrador;

      if (!urlPresigned || !urlPresigned.startsWith('http')) {
        throw new Error(`Atención ID ${item.idAtencion || item.id} no tiene una Pre-Signed URL válida.`);
      }

      // 2. Descargar el archivo directamente desde Cloudflare R2
      // Se usa mode: 'cors' y credenciales omitidas para evitar conflictos de CORS con R2
      const respuesta = await fetch(urlPresigned, {
        method: 'GET',
        mode: 'cors'
      });

      if (!respuesta.ok) {
        throw new Error(`HTTP ${respuesta.status} al descargar atención ID ${item.idAtencion}`);
      }

      const blob = await respuesta.blob();

      // 3. Obtener el nombre del archivo exacto (ej: "atencion_284_borrador.pdf")
      const idAtencion = item.idAtencion || item.id;
      const nombreArchivo = item.nombreArchivo || `atencion_${idAtencion}_borrador.pdf`;

      // 4. Agregar directamente a la raíz del ZIP para facilitar la extracción en C:\ReFirma\Entrada
      zip.file(nombreArchivo, blob);

      procesados++;
      if (onProgreso) {
        onProgreso(Math.round((procesados / total) * 100));
      }
    });

    // Esperar a que se descarguen todos los PDFs en paralelo
    await Promise.all(descargas);

    // 5. Generar y descargar el archivo ZIP localmente
    const contenidoZip = await zip.generateAsync({ type: "blob" });
    const fechaHora = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    saveAs(contenidoZip, `Lote_ReFirma_Entrada_${fechaHora}.zip`);

    return true;

  } catch (error) {
    console.error("Error al generar el lote ZIP:", error);
    alert("Ocurrió un error al descargar los archivos desde Cloudflare R2. Verifica tu conexión o la vigencia de la firma temporal.");
    return false;
  }
};