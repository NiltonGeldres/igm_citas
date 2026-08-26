import React from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

export const DateSelector = ({ fecha, setFecha, onSearch, loading }) => {
  // Manejadores para cambiar día (solo modifican el estado local sin hacer fetch)
  const handlePrevDay = () => {
    const d = new Date(fecha + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    setFecha(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(fecha + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    setFecha(d.toISOString().split('T')[0]);
  };

  // Formateo de fecha
  const dateObj = new Date(fecha + 'T00:00:00');
  const fechaFormateada = dateObj.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const nombreDia = dateObj.toLocaleDateString('es-PE', { weekday: 'long' });
  const diaCapitalizado = nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1);

  return (
    <div className="date-selector-card" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#ffffff',
      borderRadius: '16px',
      padding: '12px 20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <button 
        type="button" 
        onClick={handlePrevDay}
        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', color: '#0d6efd' }}
      >
        <ChevronLeft size={24} />
      </button>

      <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1a1a1a' }}>
            {fechaFormateada}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>
            {diaCapitalizado}
          </div>
        </div>

        {/* Botón de búsqueda compacto incrustado discretamente */}
        {onSearch && (
          <button
            type="button"
            onClick={onSearch}
            disabled={loading}
            title="Buscar agendados"
            style={{
              border: 'none',
              background: '#0d6efd',
              color: '#ffffff',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginLeft: '6px',
              padding: 0
            }}
          >
            <Search size={14} />
          </button>
        )}
      </div>

      <button 
        type="button" 
        onClick={handleNextDay}
        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', color: '#0d6efd' }}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};