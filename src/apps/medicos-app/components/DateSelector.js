import { ChevronLeft, ChevronRight } from "lucide-react";

export const DateSelector = ({ fecha, setFecha }) => {
  const cambiarFecha = (dias) => {
    const nueva = new Date(fecha + 'T00:00:00');
    nueva.setDate(nueva.getDate() + dias);
    setFecha(nueva.toISOString().split('T')[0]);
  };

  const fechaObj = new Date(fecha + 'T00:00:00');

  return (
    <div className="date-selector">
      <button onClick={() => cambiarFecha(-1)}><ChevronLeft size={24} /></button>
      <div className="date-display">
        <div className="date-text">
            {fechaObj.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
        </div>
        <div className="day-text">
            {fechaObj.toLocaleDateString('es-ES', { weekday: 'long' })}
        </div>
      </div>
      <button onClick={() => cambiarFecha(1)}><ChevronRight size={24} /></button>
    </div>
  );
};

