export const CabeceraPaciente = ({ datosPaciente }) => {
  return (
    <div className="cabecera-paciente border-b pb-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <span className="text-xs text-gray-500 block">Paciente</span>
        <strong className="text-sm">{datosPaciente.name || 'Sin especificar'}</strong>
      </div>
      <div>
        <span className="text-xs text-gray-500 block">Documento / HC</span>
        <span className="text-sm">{datosPaciente.id || '-'} / HC: {datosPaciente.hc || '-'}</span>
      </div>
      <div>
        <span className="text-xs text-gray-500 block">Edad / Sexo</span>
        <span className="text-sm">{datosPaciente.age ? `${datosPaciente.age} años` : '-'} / {datosPaciente.sex || '-'}</span>
      </div>
      <div>
        <span className="text-xs text-gray-500 block">N° Atención</span>
        <span className="text-sm font-semibold">{datosPaciente.idAtencion || 'Borrador'}</span>
      </div>
    </div>
  );
};