export const PanelProcesoFirma = ({ estadoFirma, alCambiarPin, pin }) => {
  return (
    <div className="panel-proceso-firma border rounded-lg p-4 bg-blue-50/50 border-blue-100 mt-4">
      <h4 className="text-sm font-bold text-blue-900 mb-2">Autenticación de Firma Digital</h4>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            PIN o Clave Privada
          </label>
          <input
            type="password"
            value={pin}
            onChange={(e) => alCambiarPin(e.target.value)}
            placeholder="Ingrese su clave de firma"
            className="w-full px-3 py-2 border rounded-md text-sm bg-white"
            disabled={estadoFirma === 'PROCESANDO'}
          />
        </div>
        <div className="text-xs text-gray-600">
          <span>Estado: </span>
          <strong className="uppercase">{estadoFirma}</strong>
        </div>
      </div>
    </div>
  );
};