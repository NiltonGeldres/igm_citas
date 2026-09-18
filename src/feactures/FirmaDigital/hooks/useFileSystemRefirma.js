// src/hooks/useFileSystemRefirma.js

/**
 * Solicita al usuario seleccionar la carpeta de entrada de ReFirma
 * (ej: C:\igm_salud\refirma\entrada) y guarda el Handle en memoria.
 */
export async function solicitarAccesoCarpetaEntrada() {
  try {
    if (!('showDirectoryPicker' in window)) {
      alert("Tu navegador no soporta la File System Access API. Usa Chrome o Edge.");
      return null;
    }

    // Abre el selector nativo de Windows para carpetas
    const dirHandle = await window.showDirectoryPicker({
      mode: 'readwrite',
      startIn: 'documents'
    });

    return dirHandle;
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error("Error al obtener acceso a la carpeta:", error);
    }
    return null;
  }
}

/**
 * Guarda una lista de atenciones (PDFs) directamente en la carpeta física seleccionada.
 */
export async function guardarPDFsEnCarpetaEntrada(dirHandle, atencionesSeleccionadas, onProgreso) {
  if (!dirHandle) {
    throw new Error("No hay acceso concedido a la carpeta local.");
  }

  let procesados = 0;
  const total = atencionesSeleccionadas.length;

  for (const item of atencionesSeleccionadas) {
    console.log("PDFS "+JSON.stringify(atencionesSeleccionadas))
    const urlPresigned = item.rutaPdfFirmado || item.urlPdfBorrador || item.rutaPdfBorrador;

    if (!urlPresigned || !urlPresigned.startsWith('http')) {
      console.error(`Atención ID ${item.idAtencion || item.id} no tiene Pre-Signed URL válida.`);
      continue;
    }

    // 1. Descargar el binario desde Cloudflare R2
    const respuesta = await fetch(urlPresigned, { method: 'GET', mode: 'cors' });
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status} al obtener PDF.`);
    const blob = await respuesta.blob();

    // 2. Definir el nombre del archivo
    const idAtencion = item.idAtencion || item.id;
    const nombreArchivo = item.nombreArchivo || `atencion_${idAtencion}_borrador.pdf`;

    // 3. Crear y escribir el archivo físicamente en C:\igm_salud\refirma\entrada
    const fileHandle = await dirHandle.getFileHandle(nombreArchivo, { create: true });
    const writableStream = await fileHandle.createWritable();
    await writableStream.write(blob);
    await writableStream.close(); // Cierra y asegura la escritura en disco

    procesados++;
    if (onProgreso) {
      onProgreso(Math.round((procesados / total) * 100));
    }
  }

  return true;
}

// Invocación por iframe transparente
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
// FUNCIONES AUXILIARES DE LECTURA DE CARPETA DE SALIDA (ReFirma Salida)
// ============================================================================

/**
 * Solicita acceso a la carpeta C:\igm_salud\refirma\salida en el disco local
 */
export const solicitarAccesoCarpetaSalida = async () => {
  try {
    if (!('showDirectoryPicker' in window)) {
      alert("Tu navegador no soporta File System Access API. Usa Google Chrome o Microsoft Edge.");
      return null;
    }

    const dirHandle = await window.showDirectoryPicker({
      mode: 'read',
      id: 'refirma_salida_folder'
    });

    return dirHandle;
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error("Error al seleccionar la carpeta de salida:", error);
    }
    return null;
  }
};

/**
 * Lee todos los archivos PDF presentes en la carpeta de salida seleccionada
 */
export const leerPDFsDeCarpetaSalida = async (dirHandle) => {
  try {
    const archivosFirmados = [];

    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.pdf')) {
        const file = await entry.getFile();
        archivosFirmados.push({
          nombreArchivo: entry.name,
          blob: file,
          file: file
        });
      }
    }

    return archivosFirmados;
  } catch (error) {
    console.error("Error al leer archivos de la carpeta de salida:", error);
    throw error;
  }
};

