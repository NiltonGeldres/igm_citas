export const ResumenSeccionesClinicas = ({ secciones }) => {
  const titulosPaneles = {
    PanelTriaje: 'Triaje',
    PanelAntecedentes: 'Antecedentes',
    PanelExamenFisico: 'Examen Físico',
    PanelSintomas: 'Síntomas y Anamnesis',
    PanelTratamientos: 'Tratamientos',
    PanelDiagnostico: 'Diagnóstico',
    PanelPlanTrabajo: 'Plan de Trabajo',
    PanelMedicacion: 'Medicación',
    PanelAlta: 'Alta Médica',
  };

  return (
    <div className="resumen-secciones space-y-3">
      <h3 className="text-md font-bold text-gray-700">Resumen Clínico a Firmar</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(secciones).map(([clave, contenido]) => {
          const tieneDatos = Array.isArray(contenido) ? contenido.length > 0 : Boolean(contenido);
          return (
            <div key={clave} className={`p-3 rounded border ${tieneDatos ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
              <span className="text-xs font-semibold text-gray-500 uppercase">{titulosPaneles[clave] || clave}</span>
              <p className="text-sm mt-1">
                {tieneDatos ? `${Array.isArray(contenido) ? contenido.length : 1} registro(s) cargado(s)` : 'Sin registros'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};