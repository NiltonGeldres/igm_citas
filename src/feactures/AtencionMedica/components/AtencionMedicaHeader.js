import React, { useState, useEffect } from 'react';
import { User, RefreshCw, Cloud, Calendar, FileText } from 'lucide-react';
import { formatCapitalize } from '../utils/textFormatter';
import TabNavigation from './TabNavigation';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

function AtencionMedicaHeader({ 
  patientData, 
  estadoGuardado, 
  onOpenAgenda, 
  onOpenHistoriaClinica, 
  activeTab, 
  setActiveTab 
}) {
  const isMobile = useIsMobile();

  return (
    <div className="fixed-header-wrapper-hce" style={{ padding: '8px 12px 0 12px' }}>
      <div 
        style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '12px', 
          border: '1px solid #e2e8f0', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
          overflow: 'hidden'
        }}
      >
        {/* CABECERA PRINCIPAL DEL PACIENTE */}
        <div style={{ padding: '12px 16px' }}>
          {patientData?.id ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
              
              {/* Lado Izquierdo: Avatar + Nombre + Datos */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                <button
                  type="button"
                  onClick={onOpenAgenda}
                  title="Cambiar paciente de la lista"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    cursor: 'pointer',
                    flexShrink: 0,
                    padding: 0
                  }}
                >
                  <User size={20} color="#0284c7" strokeWidth={2.2} />
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 
                      style={{ 
                        margin: 0, 
                        fontSize: '15px', 
                        color: '#0f172a', 
                        fontWeight: '700',
                        lineHeight: '1.2',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={patientData.name || patientData.nombre}
                    >
                      {formatCapitalize(patientData.name || patientData.nombre || '')}
                    </h2>

                    {/* Cloud Sync State */}
                    <div className={`status-cloud-indicator sync-${estadoGuardado}`} style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                      {estadoGuardado === 'saving' && <RefreshCw size={14} className="spinner-sync" color="#2563eb" />}
                      {estadoGuardado === 'saved' && <Cloud size={14} color="#16a34a" />}
                      {estadoGuardado === 'idle' && <Cloud size={14} color="#64748b" />}
                      {estadoGuardado === 'error' && <Cloud size={14} color="#dc2626" />}
                    </div>
                  </div>

                  {/* Detalle Demográfico */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '2px 7px', borderRadius: '4px', fontSize: '11.5px', fontWeight: '500' }}>
                      <strong>Nro Atención:</strong> {patientData.idAtencion || patientData.idCita || '285'}
                    </span>
                    <span style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '2px 7px', borderRadius: '4px', fontSize: '11.5px', fontWeight: '500' }}>
                      <strong>Sexo:</strong> {patientData.sexo ? formatCapitalize(patientData.sexo) : 'Femenino'}
                    </span>
                    <span style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '2px 7px', borderRadius: '4px', fontSize: '11.5px', fontWeight: '500' }}>
                      <strong>Edad:</strong> {patientData.edad ? patientData.edad : '76 años'}
                    </span>
                    <span 
                      onClick={onOpenHistoriaClinica}
                      style={{ 
                        backgroundColor: '#eff6ff', 
                        color: '#1d4ed8', 
                        padding: '2px 7px', 
                        borderRadius: '4px', 
                        fontSize: '11.5px', 
                        fontWeight: '700', 
                        border: '1px solid #dbeafe',
                        cursor: 'pointer'
                      }}
                    >
                      HC: {patientData.hc || patientData.id || '21447464'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lado Derecho: Botón Naranja / Azul "Historia Clínica" según maqueta */}
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={onOpenHistoriaClinica}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#0284c7', // #f59e0b si deseas usar el estilo naranja de la maqueta
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '7px 14px',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <FileText size={15} />
                  <span>Historia Clínica</span>
                </button>
              </div>

            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                Ningún paciente seleccionado
              </h2>
              <button 
                type="button" 
                onClick={onOpenAgenda}
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '6px 12px', 
                  borderRadius: '6px', 
                  backgroundColor: '#0284c7', 
                  border: 'none', 
                  color: '#ffffff', 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  cursor: 'pointer' 
                }}
              >
                <Calendar size={15} />
                Lista de Citas
              </button>
            </div>
          )}
        </div>

        {/* NAVEGACIÓN EN MÓVIL */}
        {isMobile && (
          <>
            <div style={{ borderTop: '1px solid #f1f5f9' }} />
            <TabNavigation
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              isDisabled={!patientData?.id}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default AtencionMedicaHeader;