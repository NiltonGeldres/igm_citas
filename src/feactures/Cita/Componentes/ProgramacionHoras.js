import React, { useState, useEffect } from "react";
import { Clock, AlertCircle, Loader2, CalendarCheck } from "lucide-react";
import CitaService from "../CitaService";

const ProgramacionHoras = ({ 
  idMedico, 
  idEspecialidad, 
  fechaCalendar, 
  onHoraSeleccionada, 
  horaActualSeleccionada 
}) => {
  const [horas, setHoras] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarHoras = async () => {
      if (!idMedico || !idEspecialidad || !fechaCalendar) {
        setHoras([]);
        return;
      }

      setLoading(true);
      try {
        const response = await CitaService.getCitaDisponible(idMedico, idEspecialidad, fechaCalendar);
//        console.log("HORAS  :", JSON.stringify(response));
        setHoras(response.data.cita || []);
      } catch (error) {
        console.error("Error cargando horas:", error);
        setHoras([]);
      } finally {
        setLoading(false);
      }
    };
    cargarHoras();
  }, [idMedico, idEspecialidad, fechaCalendar]);

  // Estilos personalizados para corregir los errores visuales
  const styles = {
    container: {
      fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
      color: "#334155"
    },
    headerTitle: {
      color: "#1e293b", // Gris muy oscuro, nunca blanco
      fontSize: "1.1rem",
      fontWeight: "700"
    },
    gridScroll: {
      maxHeight: '400px',
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: '5px'
    },
    btnHora: (isSelected) => ({
      transition: "all 0.2s ease",
      fontWeight: "600",
      fontSize: "0.95rem",
      borderRadius: "8px",
      border: isSelected ? "2px solid #0d6efd" : "1px solid #e2e8f0",
      backgroundColor: isSelected ? "#0d6efd" : "#ffffff",
      color: isSelected ? "#ffffff" : "#0d6efd", // Texto azul si no está seleccionado
      boxShadow: isSelected ? "0 4px 6px -1px rgba(13, 110, 253, 0.3)" : "none",
    })
  };

  if (loading) return (
    <div className="d-flex flex-column align-items-center py-5">
      <Loader2 className="text-primary animate-spin mb-2" size={32} />
      <span className="text-muted fw-medium">Buscando turnos...</span>
    </div>
  );

  if (!fechaCalendar) return (
    <div className="card border-0 bg-light mt-3">
      <div className="card-body text-center py-4">
        <CalendarCheck size={40} className="text-muted mb-2 opacity-50" />
        <p className="text-secondary mb-0">Selecciona un día en el calendario para ver las horas.</p>
      </div>
    </div>
  );

  return (
    <div className="mt-2" style={styles.container}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 style={styles.headerTitle} className="mb-0 d-flex align-items-center">
          <Clock size={20} className="me-2 text-primary" />
          Horarios Disponibles
        </h6>
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3">
          {fechaCalendar}
        </span>
      </div>
      
      {horas.length > 0 ? (
        <div style={styles.gridScroll} className="custom-scrollbar">
          <div className="row g-3"> {/* g-3 aumenta el espacio para evitar superposición */}
            {horas.map((h, index) => {
              const isSelected = horaActualSeleccionada === h.horaInicio;
              return (
                <div key={index} className="col-6 col-sm-4 col-md-6 col-xl-4">
                  <button
                    onClick={() => onHoraSeleccionada(h.horaInicio, h.idProgramacion, h.idServicio)}
                    style={styles.btnHora(isSelected)}
                    className="btn btn-hora-hover w-100 py-2 d-flex align-items-center justify-content-center"
                  >
                    {h.horaInicio}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="alert alert-warning d-flex align-items-center" role="alert">
          <AlertCircle size={18} className="me-2" />
          <div>No hay cupos para esta fecha.</div>
        </div>
      )}

      {/* Estilos CSS adicionales para el Hover y Scroll */}
      <style>{`
        .btn-hora-hover:hover {
          background-color: #f8fafc !important;
          color: #0284c7 !important; /* Azul más oscuro al pasar el mouse */
          border-color: #0284c7 !important;
          transform: translateY(-2px);
        }
        .btn-hora-hover:active {
          transform: translateY(0);
        }
        /* Evita el texto blanco en el hover si no está seleccionado */
        .btn-primary.btn-hora-hover:hover {
          background-color: #0b5ed7 !important;
          color: white !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default ProgramacionHoras;