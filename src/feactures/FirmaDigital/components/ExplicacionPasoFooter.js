export const ExplicacionPasoFooter = ({ pasoActual }) => {
  const mensajes = {
    1: "Solo los archivos copiados/descargados a C:\\ReFirma\\Entrada habilitan su casilla. Los pendientes permanecen deshabilitados.",
    2: "El panel de vista previa evalúa el estado del archivo seleccionado. Si el archivo no figura como firmado en C:\\ReFirma\\Salida, la visualización se bloquea explícitamente.",
    3: "Al presionar Confirmar Guardado, el backend sube los archivos de salida a Cloudflare R2, actualiza PostgreSQL/Neon y realiza la limpieza local."
  };

  return (
    <div className="fd-footer-info">
      <strong style={{ color: '#38bdf8' }}>Explicación Paso {pasoActual}: </strong>
      {mensajes[pasoActual]}
    </div>
  );
};