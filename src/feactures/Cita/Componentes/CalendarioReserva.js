import { useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const CalendarioReserva = ({ 
  fechaObjeto, 
  cambiarMes, 
  programacionMensual, 
  seleccionarDia, 
  cargando 
}) => {
  const { mes, anio, dia: diaSeleccionado } = fechaObjeto;

  // Lógica de construcción de cuadrícula (similar a tu código de Gestión)
  const celdas = useMemo(() => {
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();
    const primerDiaMes = new Date(anio, mes, 1).getDay(); 
    const offset = (primerDiaMes === 0 ? 6 : primerDiaMes - 1);
    const nombreMes = new Intl.DateTimeFormat('es-ES', { month: 'long' })
      .format(new Date(anio, mes));
    const listaCeldas = [];

    // Celdas vacías (Offset)
    for (let i = 0; i < offset; i++) {
      listaCeldas.push(<div key={`vacia-${i}`} className="p-2 border-0 opacity-25" />);
    }
    // Días del mes
    for (let d = 1; d <= diasEnMes; d++) {
      // Tu lógica de negocio: ¿Hay programación este día?
    const tieneProgramacion = programacionMensual.some(p => 
    parseInt(p.fechadia) === d && p.idProgramacion !== 0
    );     
    //const tieneProgramacion = programacionMensual.some(p => parseInt(p.fechadia) === d );
    const esSeleccionado = diaSeleccionado === d;

      listaCeldas.push(
        <div key={d} className="p-1">
          <button
            disabled={!tieneProgramacion || cargando}
            onClick={() => seleccionarDia(d)}
            className={`
              btn w-100 position-relative d-flex flex-column align-items-center justify-content-center
              border transition-all rounded-3
              ${esSeleccionado ? 'btn-primary shadow-sm border-primary' : 'bg-white'}
              ${!tieneProgramacion ? 'opacity-25 border-transparent' : 'border-light-subtle hover-shadow'}
            `}
            style={{ aspectRatio: '1/1', fontSize: '0.9rem' }}
          >
            <span className={`fw-bold ${esSeleccionado ? 'text-white' : 'text-dark'}`}>{d}</span>
            
            {tieneProgramacion && (
              <div className="mt-1 d-flex gap-1 justify-content-center">
                {/* Icono de reloj pequeño similar a tu CeldaCalendario */}
                <Clock size={10} className={esSeleccionado ? 'text-white' : 'text-success'} />
              </div>
            )}
          </button>
        </div>
      );
    }
    return { listaCeldas, nombreMes };
  }, [anio, mes, programacionMensual, diaSeleccionado, cargando]);

  
  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
      {/* Header del Calendario */}
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white">
        <button onClick={() => cambiarMes(-1)} className="btn btn-sm btn-outline-secondary border-0 rounded-circle"><ChevronLeft size={18}/></button>
        <h6 className="fw-bold mb-0 text-capitalize">{celdas.nombreMes} <span className="text-primary">{anio}</span></h6>
        <button onClick={() => cambiarMes(1)} className="btn btn-sm btn-outline-secondary border-0 rounded-circle"><ChevronRight size={18}/></button>
      </div>

      {/* Grid Responsivo */}
      <div className="p-2 bg-light-subtle">
        <div className="d-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {DIAS_SEMANA.map(d => (
            <div key={d} className="text-center py-2 text-secondary fw-bold" style={{ fontSize: '0.65rem' }}>{d}</div>
          ))}
          {celdas.listaCeldas}
        </div>
      </div>
      
      {cargando && (
        <div className="position-absolute top-50 start-50 translate-middle">
          <div className="spinner-border text-primary spinner-border-sm" />
        </div>
      )}
    </div>
  );
};

export default CalendarioReserva;