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

// ---  Eliminar todos los archivos existentes en la carpeta antes de copiar ---
  try {
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file') {
        await dirHandle.removeEntry(entry.name);
      }
    }
  } catch (error) {
    console.error("Error al limpiar la carpeta de entrada:", error);
    throw new Error("No se pudo vaciar la carpeta de entrada antes de copiar los nuevos archivos.");
  }
  //--------------------------------------------------------------

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


// ============================================================================
// src/services/refirmaFileSystem.js
// ============================================================================

/**
 * Solicita acceso a la carpeta local usando el File System Access API.
 * Utiliza el alias seguro 'documents' para el parámetro startIn.
 * @param {string} tipo - 'entrada' o 'salida'
 */
export async function solicitarAccesoCarpeta(tipo) {
  try {
    if (!('showDirectoryPicker' in window)) {
      alert("Tu navegador no soporta la File System Access API. Utiliza Google Chrome o Microsoft Edge.");
      return null;
    }

    // El navegador exige un alias estándar como 'documents' para startIn
    const dirHandle = await window.showDirectoryPicker({
      mode: 'readwrite',
      startIn: 'documents',
      id: `refirma_${tipo}_folder_v1`
    });

    return dirHandle;
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error(`Error al obtener acceso a la carpeta de ${tipo}:`, error);
    }
    return null;
  }
}

/**
 * Vacía por completo el contenido del directorio en cada transición de paciente.
 * @param {FileSystemDirectoryHandle} dirHandle - Handle de la carpeta a limpiar
 */
export async function limpiarCarpeta(dirHandle) {
  if (!dirHandle) return;
  try {
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file') {
        await dirHandle.removeEntry(entry.name);
      }
    }
  } catch (error) {
    console.error("Error al limpiar la carpeta local:", error);
    throw new Error("No se pudo vaciar la carpeta local de ReFirma.");
  }
}

/**
 * Prepara el PDF borrador: limpia la carpeta de entrada y descarga el archivo 
 * nombrado de forma estricta con el ID de la atención actual.
 * @param {FileSystemDirectoryHandle} dirEntradaHandle - Handle de la carpeta de entrada
 * @param {Object} atencionItem - Objeto que contiene los datos de la atención y la URL del PDF
 */
export async function prepararPDFParaFirma(dirEntradaHandle, atencionItem) {
  if (!dirEntradaHandle) {
    throw new Error("No hay acceso concedido a la carpeta de entrada.");
  }

  // 1. Limpieza obligatoria previa para evitar residuos de otros pacientes
  await limpiarCarpeta(dirEntradaHandle);

  const urlPresigned = atencionItem.rutaPdfFirmado || atencionItem.urlPdfBorrador || atencionItem.rutaPdfBorrador;
  if (!urlPresigned || !urlPresigned.startsWith('http')) {
    throw new Error("La atención no cuenta con una URL válida para descargar el documento borrador.");
  }

  // 2. Descarga del binario desde la nube (Cloudflare R2)
  const respuesta = await fetch(urlPresigned, { method: 'GET', mode: 'cors' });
  if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status} al obtener el PDF de la nube.`);
  const blob = await respuesta.blob();

  // 3. Nombramiento estricto usando el ID de atención
  const idAtencion = atencionItem.idAtencion || atencionItem.id;
  const nombreArchivo = `atencion_${idAtencion}_borrador.pdf`;

  // 4. Escritura física en la carpeta local de entrada
  const fileHandle = await dirEntradaHandle.getFileHandle(nombreArchivo, { create: true });
  const writableStream = await fileHandle.createWritable();
  await writableStream.write(blob);
  await writableStream.close();

  return true;
}

/**
 * Lee la carpeta de salida y busca el PDF firmado filtrando estrictamente 
 * por el ID de la atención actual para evitar procesar archivos incorrectos.
 * @param {FileSystemDirectoryHandle} dirSalidaHandle - Handle de la carpeta de salida
 * @param {string|number} idAtencionEsperado - ID de la atención en curso
 */
export async function buscarPdfFirmadoPorAtencion(dirSalidaHandle, idAtencionEsperado) {
  if (!dirSalidaHandle) {
    throw new Error("No hay acceso concedido a la carpeta de salida.");
  }

  try {
    for await (const entry of dirSalidaHandle.values()) {
      if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.pdf')) {
        // Validación estricta: el archivo debe pertenecer obligatoriamente al ID actual
        if (entry.name.includes(`${idAtencionEsperado}`)) {
          const file = await entry.getFile();
          return {
            nombreArchivo: entry.name,
            blob: file,
            file: file
          };
        }
      }
    }
    return null; // El archivo firmado aún no se encuentra en salida
  } catch (error) {
    console.error("Error al leer la carpeta de salida:", error);
    throw error;
  }
}


