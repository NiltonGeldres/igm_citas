import React, { useState } from 'react';

const ScheduleForm = ({ employeeId, initialSchedule, onScheduleChange }) => {
  const [schedule, setSchedule] = useState(initialSchedule);

  const handleDayChange = (day) => {
    const updatedSchedule = {
      ...schedule,
      [day]: !schedule[day],
    };
    setSchedule(updatedSchedule);
    onScheduleChange(employeeId, updatedSchedule);
  };

  const handleTimeChange = () => {
  };

  return (
    <div>
      <h3>Programar Horario</h3>
      <form>
        <label>
          <input
            type="checkbox"
            checked={schedule.monday}
            onChange={() => handleDayChange('monday')}
          />
          Lunes
        </label>
        {/* Repite este bloque para cada día de la semana */}
        {/* Ajusta según sea necesario para tu caso específico */}

        <br />

        <label>
          Hora de entrada:
          <input
            type="time"
            value={schedule.startTime}
            onChange={(e) => handleTimeChange('startTime', e.target.value)}
          />
        </label>
        <br />

        <label>
          Hora de salida:
          <input
            type="time"
            value={schedule.endTime}
            onChange={(e) => handleTimeChange('endTime', e.target.value)}
          />
        </label>
      </form>
    </div>
  );
};

export default ScheduleForm;