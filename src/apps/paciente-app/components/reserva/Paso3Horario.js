import React from 'react';
//import CalendarioReserva from './CalendarioReserva';
//import ProgramacionHoras from './ProgramacionHoras';

import CalendarioReserva from '../../../../feactures/Cita/Componentes/CalendarioReserva';
import ProgramacionHoras from "../../../../feactures/Cita/Componentes/ProgramacionHoras"

export const Paso3Horario = ({ 
  datosReserva, 
  programacionMensual, 
  cambiarMes, 
  seleccionarDia, 
  onHoraSeleccionada, 
  cargando,
  onSiguiente,
  onAtras
}) => {
  console.log("datosReserva  Paso3hORARIO "+JSON.stringify(datosReserva))

  return (
    <div className="fade-in">
      {/* Título de sección */}
      <div className="mb-4">
        <h5 className="fw-bold mb-1 text-dark">Selecciona Fecha y Hora</h5>
        <p className="text-muted small">Los días marcados con un reloj tienen disponibilidad.</p>
      </div>

      <div className="row g-4">
        {/* COLUMNA: El Calendario */}
        <div className="col-12">
          <CalendarioReserva 
            fechaObjeto={datosReserva.fechaObjeto}
            cambiarMes={cambiarMes}
            programacionMensual={programacionMensual}
            seleccionarDia={seleccionarDia}
            cargando={cargando}
          />
        </div>

        {/* COLUMNA: Selector de Horas (Se muestra siempre, pero se activa al elegir un día) */}
        <div className="col-12 mt-2">
          <ProgramacionHoras 
            idMedico={datosReserva.doctor?.id}
            idEspecialidad={datosReserva.especialidad?.idEspecialidad}
            fechaCalendar={datosReserva.fechaYYYYMMDD}
            horaActualSeleccionada={datosReserva.hora}
            onHoraSeleccionada={onHoraSeleccionada}
          />
        </div>
      </div>

      {/* Botones de navegación inferior */}
      <div className="mt-4 d-flex justify-content-between align-items-center bg-light p-3 rounded-4">
        <button 
          className="btn btn-link text-secondary fw-bold text-decoration-none" 
          onClick={onAtras}
        >
          Atrás
        </button>
        <button 
          className="btn btn-primary px-5 fw-bold rounded-3 shadow-sm" 
          disabled={!datosReserva.fechaObjeto.dia || !datosReserva.hora}
          onClick={onSiguiente}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};