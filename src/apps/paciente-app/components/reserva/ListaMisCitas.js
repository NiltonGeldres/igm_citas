import React, { useState } from 'react';
import { Calendar, Plus, Share2, Download, X, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useAuth } from '../../../../shared/context/AuthContext';
// ==========================================
// ESTILOS NATIVOS (CERO BOOTSTRAP) PARA EL MODAL
// ==========================================
const ESTILOS_MODAL = {
  overlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' },
  contenedor: { backgroundColor: '#1e293b', width: '100%', maxWidth: '380px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative', display: 'flex', flexDirection: 'column' },
  btnCerrar: { position: 'absolute', top: '16px', right: '16px', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  cuerpoBoucher: { padding: '36px 24px 28px 24px', color: '#fff', textAlign: 'center', fontFamily: 'system-ui, sans-serif' },
  barraAcciones: { backgroundColor: '#0f172a', padding: '16px 24px', display: 'flex', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' },
  btnPrimario: { flex: 1, backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' },
  btnSecundario: { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.15)', padding: '12px', borderRadius: '12px', fontWeight: '500', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
  btnSoloVer: { backgroundColor: 'transparent', color: '#94a3b8', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '500', fontSize: '13px', cursor: 'pointer' }
};

export const ListaMisCitas = ({ misCitas, onNuevaCita }) => {
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [procesandoDescarga, setProcesandoDescarga] = useState(false);
  const [procesandoCompartir, setProcesandoCompartir] = useState(false);
  const { user } = useAuth();
  // ==========================================
  // FUNCIÓN 1: DESCARGAR / BAJAR EL ARCHIVO
  // ==========================================
  const ejecutarDescarga = async () => {
    if (!citaSeleccionada) return;
    setProcesandoDescarga(true);

    try {
      const elementoBoucher = document.getElementById(`boucher-visual-${citaSeleccionada.id}`);
      if (!elementoBoucher) return;

      const canvas = await html2canvas(elementoBoucher, { scale: 2, backgroundColor: '#1e293b' });
      const dataUrl = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.download = `Boucher_Cita_${citaSeleccionada.id}.png`;
      link.href = dataUrl;
      link.click();
      
    } catch (error) {
      console.error("Error al bajar el archivo:", error);
    } finally {
      setProcesandoDescarga(false);
    }
  };

  // ==========================================
  // FUNCIÓN 2: COMPARTIR EN REDES (MÓVIL)
  // ==========================================
  const ejecutarCompartir = async () => {
    if (!citaSeleccionada) return;
    setProcesandoCompartir(true);

    try {
      const elementoBoucher = document.getElementById(`boucher-visual-${citaSeleccionada.id}`);
      if (!elementoBoucher) return;

      const canvas = await html2canvas(elementoBoucher, { scale: 2, backgroundColor: '#1e293b' });
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const archivo = new File([blob], `Boucher_Cita_${citaSeleccionada.id}.png`, { type: 'image/png' });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [archivo] })) {
          await navigator.share({
            title: 'Mi Cita Médica',
            text: `Comparto mi boucher de atención para ${citaSeleccionada.servicioNombre}`,
            files: [archivo]
          });
        } else {
          ejecutarDescarga();
        }
      }, 'image/png');

    } catch (error) {
      console.error("Error al compartir:", error);
    } finally {
      setProcesandoCompartir(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      <h5 className="fw-bold">Mis Citas</h5>
      
      {misCitas.length > 0 ? (
        misCitas.map(cita => (
          <div 
            key={cita.id} 
            onClick={() => setCitaSeleccionada(cita)}
            className="tarjeta-personalizada bg-white p-4 shadow-sm border-start border-primary border-4" 
            style={{ cursor: 'pointer' }}
          >
            <div className="d-flex justify-content-between mb-2">
              <div>
                <p className="fw-bold mb-0">{cita.servicioNombre}</p>
                <p className="text-secondary small mb-0">{cita.nombres}</p>
              </div>
              <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-3 h-fit">
                <Calendar size={18} />
              </div>
            </div>
            <div className="pt-3 border-top d-flex justify-content-between align-items-center">
              <div>
                <span className="text-uppercase text-secondary fw-bold d-block" style={{fontSize: '10px'}}>{cita.fechaLabel || cita.fecha}</span>
                <span className="fw-bold text-dark" style={{fontSize: '12px'}}>{cita.horainicio}</span>
              </div>
              <span className="etiqueta-pago bg-success bg-opacity-10 text-success">Confirmado</span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-5 text-secondary opacity-50">
          <Calendar size={48} className="mb-3" />
          <p>No tienes citas programadas</p>
        </div>
      )}

      <button onClick={onNuevaCita} className="btn btn-primary p-3 rounded-4 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mt-2">
        <Plus size={20} /> Nueva Cita
      </button>

      {/* ================================================================= */}
      {/* MODAL DE VISTA PREVIA OPTIMIZADO (SIN QR)                         */}
      {/* ================================================================= */}
      {citaSeleccionada && (
        <div style={ESTILOS_MODAL.overlay} onClick={() => setCitaSeleccionada(null)}>
          <div style={ESTILOS_MODAL.contenedor} onClick={(e) => e.stopPropagation()}>
            
            <button style={ESTILOS_MODAL.btnCerrar} onClick={() => setCitaSeleccionada(null)}>
              <X size={16} />
            </button>

            {/* CUERPO DEL TICKET */}
            <div id={`boucher-visual-${citaSeleccionada.id}`} style={ESTILOS_MODAL.cuerpoBoucher}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '4px' }}>{user.nombreEntidad}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '24px' }}>Comprobante de Reserva Digital</div>
              
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <Check size={32} color="#fff" />
              </div>
              
              <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '2px' }}>¡Cita Confirmada!</div>
              <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: '600', backgroundColor: 'rgba(34,197,94,0.1)', display: 'inline-block', padding: '4px 12px', borderRadius: '20px', marginBottom: '28px' }}>Operación Exitosa</div>

              <hr style={{ borderTop: '1px dashed rgba(148,163,184,0.2)', margin: '0 0 24px 0' }} />

              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Servicio / Especialidad</span>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#f8fafc' }}>{citaSeleccionada.servicioNombre}</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Paciente</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#cbd5e1' }}>{citaSeleccionada.nombres}</span>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fecha</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#cbd5e1' }}>{citaSeleccionada.fechaLabel || citaSeleccionada.fecha}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hora de Atención</span>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#38bdf8' }}>{citaSeleccionada.horainicio}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BARRA DE ACCIONES INFERIOR */}
            <div style={ESTILOS_MODAL.barraAcciones}>
              <button 
                style={ESTILOS_MODAL.btnSoloVer} 
                onClick={() => setCitaSeleccionada(null)}
              >
                Solo ver
              </button>
              
              <button 
                style={ESTILOS_MODAL.btnSecundario} 
                onClick={ejecutarDescarga} 
                disabled={procesandoDescarga}
              >
                <Download size={14} />
                {procesandoDescarga ? 'Bajando...' : 'Bajar'}
              </button>

              <button 
                style={ESTILOS_MODAL.btnPrimario} 
                onClick={ejecutarCompartir} 
                disabled={procesandoCompartir}
              >
                <Share2 size={14} />
                {procesandoCompartir ? '...' : 'Compartir'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};