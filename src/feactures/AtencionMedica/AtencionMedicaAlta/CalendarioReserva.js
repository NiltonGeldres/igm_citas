import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const CalendarioReserva = ({
  fechaObjeto,
  cambiarMes,
  programacionMensual = [],
  seleccionarDia,
  cargando
}) => {
  const { mes, anio, dia: diaSeleccionado } = fechaObjeto || {
    mes: new Date().getMonth(),
    anio: new Date().getFullYear(),
    dia: null
  };

  const celdas = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const diasEnMes = new Date(anio, mes + 1, 0).getDate();
    const primerDiaMes = new Date(anio, mes, 1).getDay();
    const offset = (primerDiaMes === 0 ? 6 : primerDiaMes - 1);

    const nombreMes = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date(anio, mes));
    const listaCeldas = [];

    // Celdas vacías de desfase inicial
    for (let i = 0; i < offset; i++) {
      listaCeldas.push(<div key={`vacia-${i}`} style={{ width: '100%', height: '34px' }} />);
    }

    // Días del mes evaluando la programación mensual
    for (let d = 1; d <= diasEnMes; d++) {
      const fechaCelda = new Date(anio, mes, d);
      const esPasado = fechaCelda < hoy;

      const tieneProgramacion = Array.isArray(programacionMensual) && programacionMensual.some(p =>
        parseInt(p.fechadia ?? p.dia) === d && (p.idProgramacion !== 0 && p.idProgramacion !== null)
      );

      const esSeleccionado = diaSeleccionado === d;
      const diaHabilitado = tieneProgramacion && !esPasado;

      listaCeldas.push(
        <button
          key={d}
          type="button"
          disabled={!diaHabilitado || cargando}
          onClick={() => seleccionarDia(d)}
          style={{
            width: '100%',
            height: '34px',
            borderRadius: '6px',
            border: esSeleccionado ? '2px solid #006699' : (diaHabilitado ? '1px solid #cbd5e1' : '1px solid transparent'),
            backgroundColor: esSeleccionado ? '#006699' : (diaHabilitado ? '#ffffff' : '#f8fafc'),
            color: esSeleccionado ? '#ffffff' : (diaHabilitado ? '#0f172a' : '#cbd5e1'),
            fontWeight: esSeleccionado ? '700' : '600',
            fontSize: '11px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: diaHabilitado && !cargando ? 'pointer' : 'default',
            opacity: !tieneProgramacion || esPasado ? 0.35 : 1,
            transition: 'all 0.15s ease'
          }}
        >
          <span>{d}</span>
          {diaHabilitado && (
            <Clock size={8} color={esSeleccionado ? '#ffffff' : '#16a34a'} style={{ marginTop: '1px' }} />
          )}
        </button>
      );
    }
    return { listaCeldas, nombreMes };
  }, [anio, mes, programacionMensual, diaSeleccionado, cargando, seleccionarDia]);

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', overflow: 'hidden', position: 'relative', width: '100%' }}>
      {/* Cabecera de mes */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', borderBottom: '1px solid #e2e8f0' }}>
        <button type="button" onClick={() => cambiarMes(-1)} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '50%', display: 'flex' }}>
          <ChevronLeft size={16} />
        </button>
        <h6 style={{ margin: 0, fontWeight: '700', fontSize: '12px', color: '#0f172a', textTransform: 'capitalize' }}>
          {celdas.nombreMes} <span style={{ color: '#006699' }}>{anio}</span>
        </h6>
        <button type="button" onClick={() => cambiarMes(1)} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '50%', display: 'flex' }}>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Grid matricial */}
      <div style={{ padding: '6px', backgroundColor: '#f8fafc' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px', marginBottom: '4px' }}>
          {DIAS_SEMANA.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: '9.5px', fontWeight: '700', color: '#64748b' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
          {celdas.listaCeldas}
        </div>
      </div>

      {cargando && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#006699' }}>Cargando agenda...</span>
        </div>
      )}
    </div>
  );
};

export default CalendarioReserva;