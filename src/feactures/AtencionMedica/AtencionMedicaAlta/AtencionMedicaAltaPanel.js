import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Styles from '../../../Styles';
import useVoiceRecognition from '../../../hooks/useVoiceRecognition';
import { Mic, MicOff, Plus, Trash2, ChevronDown } from 'lucide-react';
//import { ModalReservaCitaDestino } from './ModalReservaCitaDestino'; // Import de la Modal
import { AtencionMedicaReservaCitaDestino } from '../AtencionMedicaAlta/AtencionMedicaReservaCitaDestino';

const OPCIONES_DESTINO = [
  { id: '1', label: '📝 Otras indicaciones / Recomendaciones' },
  { id: '2', label: '📅 Próxima Cita' },
  { id: '3', label: '🏥 Hospitalización' },
  { id: '4', label: '🔗 Referencia (RENAES)' },
  { id: '5', label: '✅ Alta o Cierre de Caso' },
  { id: '6', label: '🩺 Interconsulta' }
];

const AtencionMedicaAltaPanel = ({
  title = '● 6. DESTINO',
  content = [],
  onContentChange,
  idMedicoActual,
  idEspecialidadActual,
  nombreMedicoActual,
  nombreEspecialidadActual,
  onModalMessage,
  idUsuarioPaciente
}) => {
  const textareaRef = useRef(null);
  const [selectedOpcion, setSelectedOpcion] = useState('NULL');
  const [isAgendaOpen, setIsAgendaOpen] = useState(false);

  // Estados temporales de entrada
  const [textoLibre, setTextoLibre] = useState('');
  const [hospitalizacion, setHospitalizacion] = useState({ servicio: '', cama: '', nota: '' });
  const [referencia, setReferencia] = useState({ renaes: '', motivo: '' });
  const [condicionAlta, setCondicionAlta] = useState('Mejorado');
  const [interconsulta, setInterconsulta] = useState({ especialidad: '' });

  const listaAlta = useMemo(() => Array.isArray(content) ? content : [], [content]);

  // Insertar en el arreglo (Contrato estricto con el backend: idAlta y descripcionAlta)
  const agregarItemAlArray = useCallback((idAltaVal, textoDescripcion) => {
    if (!textoDescripcion || !textoDescripcion.trim()) return;

    alert("DATOS DE ALTA "+textoDescripcion+"-----"+idAltaVal)
    const nuevoElemento = {
      idAlta: idAltaVal,
      descripcionAlta: textoDescripcion.trim()
    };

    onContentChange([...listaAlta, nuevoElemento]);

    // Resetear estados
    setTextoLibre('');
    setHospitalizacion({ servicio: '', cama: '', nota: '' });
    setReferencia({ renaes: '', motivo: '' });
    setInterconsulta({ especialidad: '' });
  }, [listaAlta, onContentChange]);

  const eliminarItemDelArray = useCallback((indexEliminar) => {
    onContentChange(listaAlta.filter((_, idx) => idx !== indexEliminar));
  }, [listaAlta, onContentChange]);

  const { startListening, stopListening, isListening, error } = useVoiceRecognition(
    (transcript) => setTextoLibre(prev => prev ? `${prev.trim()} ${transcript}` : transcript),
    onModalMessage
  );

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [textoLibre]);

  const handleSelectChange = (e) => {
    const val = e.target.value;
    setSelectedOpcion(val);

    if (val === '1') {
      setIsAgendaOpen(true);
    }
  };

  // Recibir la cita confirmada desde la Modal
  const handleCitaConfirmada = (citaData) => {
   // const descripcionConcatenada = `Próxima Cita reservada para el ${citaData.fecha} a las ${citaData.hora}${citaData.especialidad ? ` (${citaData.especialidad})` : ''}`;
//    agregarItemAlArray(1, descripcionConcatenada);
    agregarItemAlArray(citaData.idAlta, citaData.descripcionAlta);
  };

  return (
    <div style={Styles.medicalSection}>
      {/* Cabecera y Select */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
        <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155' }}>
          {title}
        </label>

        <div style={{ position: 'relative', minWidth: '220px', flex: '1 1 auto', maxWidth: '320px' }}>
          <select
            value={selectedOpcion}
            onChange={handleSelectChange}
            style={{
              width: '100%',
              padding: '5px 28px 5px 10px',
              fontSize: '11.5px',
              fontWeight: '600',
              color: '#006699',
              backgroundColor: '#e0f2fe',
              border: '1px solid #bae6fd',
              borderRadius: '6px',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none'
            }}
          >
            {OPCIONES_DESTINO.map((op) => (
              <option key={op.id} value={op.id} style={{ backgroundColor: '#ffffff', color: '#0f172a' }}>
                {op.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} color="#006699" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Contenedor según opción seleccionada */}
      <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '10px' }}>
        
        {/* NULL: OTRAS INDICACIONES */}
        {selectedOpcion === '1' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#475569' }}>Indicaciones / Recomendaciones Generales</span>
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  backgroundColor: isListening ? '#fef2f2' : '#ffffff',
                  border: isListening ? '1px solid #fca5a5' : '1px solid #cbd5e1',
                  borderRadius: '12px', padding: '2px 8px', color: isListening ? '#ef4444' : '#2563eb',
                  fontSize: '10.5px', cursor: 'pointer'
                }}
              >
                {isListening ? <MicOff size={11} /> : <Mic size={11} />}
                {isListening ? 'Detener' : 'Dictar'}
              </button>
            </div>
            <textarea
              ref={textareaRef}
              rows={2}
              value={textoLibre}
              onChange={(e) => setTextoLibre(e.target.value)}
              placeholder="Escriba indicaciones generales, reposo o recomendaciones..."
              style={{ width: '100%', minHeight: '38px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', outline: 'none', resize: 'none' }}
            />
            <button
              type="button"
              disabled={!textoLibre.trim()}
              onClick={() => agregarItemAlArray(0, textoLibre)}
              style={btnAgregarStyle(!textoLibre.trim())}
            >
              <Plus size={12} /> Agregar Indicación
            </button>
          </div>
        )}

        {/* 1: PRÓXIMA CITA */}
        {selectedOpcion === '1' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#334155', fontWeight: '500' }}>
              Seleccione una fecha y hora en el calendario de citas.
            </span>
            <button
              type="button"
              onClick={() => setIsAgendaOpen(true)}
              style={{ ...btnAgregarStyle(false), width: 'auto' }}
            >
              Abrir Agenda
            </button>
          </div>
        )}

        {/* 2: HOSPITALIZACIÓN */}
        {selectedOpcion === '2' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <input type="text" placeholder="Servicio de destino (ej. Pediatría)" value={hospitalizacion.servicio} onChange={(e) => setHospitalizacion({ ...hospitalizacion, servicio: e.target.value })} style={{ ...inputStyle, flex: '1 1 180px' }} />
              <input type="text" placeholder="Cama (Opcional)" value={hospitalizacion.cama} onChange={(e) => setHospitalizacion({ ...hospitalizacion, cama: e.target.value })} style={{ ...inputStyle, flex: '0 1 100px' }} />
            </div>
            <input type="text" placeholder="Nota de transferencia o motivo de hospitalización..." value={hospitalizacion.nota} onChange={(e) => setHospitalizacion({ ...hospitalizacion, nota: e.target.value })} style={inputStyle} />
            <button type="button" disabled={!hospitalizacion.servicio.trim()} onClick={() => agregarItemAlArray(2, `Hospitalización en ${hospitalizacion.servicio}${hospitalizacion.cama ? ` (Cama: ${hospitalizacion.cama})` : ''}${hospitalizacion.nota ? ` - Nota: ${hospitalizacion.nota}` : ''}`)} style={btnAgregarStyle(!hospitalizacion.servicio.trim())}>
              <Plus size={12} /> Registrar Hospitalización
            </button>
          </div>
        )}

        {/* 3: REFERENCIA */}
        {selectedOpcion === '3' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <input type="text" placeholder="Establecimiento de destino (RENAES / Nombre)" value={referencia.renaes} onChange={(e) => setReferencia({ ...referencia, renaes: e.target.value })} style={inputStyle} />
            <input type="text" placeholder="Motivo de la referencia" value={referencia.motivo} onChange={(e) => setReferencia({ ...referencia, motivo: e.target.value })} style={inputStyle} />
            <button type="button" disabled={!referencia.renaes.trim()} onClick={() => agregarItemAlArray(3, `Referencia a: ${referencia.renaes}${referencia.motivo ? ` - Motivo: ${referencia.motivo}` : ''}`)} style={btnAgregarStyle(!referencia.renaes.trim())}>
              <Plus size={12} /> Registrar Referencia
            </button>
          </div>
        )}

        {/* 4: ALTA */}
        {selectedOpcion === '4' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '600', color: '#475569' }}>Condición al Alta:</span>
            <select value={condicionAlta} onChange={(e) => setCondicionAlta(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
              <option value="Curado">Curado</option>
              <option value="Mejorado">Mejorado</option>
              <option value="Inalterado">Inalterado</option>
            </select>
            <button type="button" onClick={() => agregarItemAlArray(4, `Alta Médica - Condición: ${condicionAlta}`)} style={{ ...btnAgregarStyle(false), width: 'auto' }}>
              <Plus size={12} /> Confirmar Cierre
            </button>
          </div>
        )}

        {/* 6: INTERCONSULTA */}
        {selectedOpcion === '6' && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Especialidad médica destino..." value={interconsulta.especialidad} onChange={(e) => setInterconsulta({ ...interconsulta, especialidad: e.target.value })} style={{ ...inputStyle, flex: '1 1 180px' }} />
            <button type="button" disabled={!interconsulta.especialidad.trim()} onClick={() => agregarItemAlArray(6, `Interconsulta a: ${interconsulta.especialidad}`)} style={{ ...btnAgregarStyle(!interconsulta.especialidad.trim()), width: 'auto' }}>
              <Plus size={12} /> Solicitar
            </button>
          </div>
        )}

      </div>

      {/* Lista de Registros Guardados en PanelAlta */}
      {listaAlta.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#64748b' }}>
            REGISTROS EN DESTINO ({listaAlta.length}):
          </span>
          {listaAlta.map((item, idx) => {
            const texto = item.descripcionAlta || item.nombreAlta || item.descripcion || '';
            return (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 10px', fontSize: '12px' }}>
                <span>{texto}</span>
                <button type="button" onClick={() => eliminarItemDelArray(idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Reserva de Cita */}
      <AtencionMedicaReservaCitaDestino
        isOpen={isAgendaOpen}
        onClose={() => setIsAgendaOpen(false)}
        idMedico={idMedicoActual}
        idEspecialidad={idEspecialidadActual}
        nombreMedico={nombreMedicoActual}
        nombreEspecialidad={nombreEspecialidadActual}
        onCitaGuardadaEnBackend={handleCitaConfirmada}
        idUsuarioPaciente={idUsuarioPaciente}
      />
    </div>
  );
};

const inputStyle = { width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', outline: 'none' };
const btnAgregarStyle = (disabled) => ({ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px', backgroundColor: disabled ? '#cbd5e1' : '#006699', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '5px 10px', fontSize: '11px', fontWeight: '600', cursor: disabled ? 'not-allowed' : 'pointer' });

export default AtencionMedicaAltaPanel;