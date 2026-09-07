export const BarraPasosFirma = ({ pasoActual, alSeleccionarPaso }) => {
  const pasos = [
    { id: 1, titulo: 'PASO 1: Descargar Lote Borrador', subtitulo: 'Copiar PDFs a C:\\ReFirma\\Entrada' },
    { id: 2, titulo: 'PASO 2: Firmar y Retorno ReFirma', subtitulo: 'Lectura desde C:\\ReFirma\\Salida' },
    { id: 3, titulo: 'PASO 3: Confirmar Guardado', subtitulo: 'Consolidar en Cloud R2 / Neon' },
  ];

  return (
    <div className="fd-steps-grid">
      {pasos.map((paso) => {
        const esActivo = pasoActual === paso.id;
        const esCompletado = pasoActual > paso.id;

        return (
          <button
            key={paso.id}
            type="button"
            onClick={() => alSeleccionarPaso(paso.id)}
            className={`fd-step-card ${esActivo ? 'active' : ''} ${esCompletado ? 'completed' : ''}`}
          >
            <div className="fd-step-header">
              <span className="fd-step-badge">{esCompletado ? '✓' : paso.id}</span>
              <span>{paso.titulo}</span>
            </div>
            <div className="fd-step-desc">{paso.subtitulo}</div>
          </button>
        );
      })}
    </div>
  );
};