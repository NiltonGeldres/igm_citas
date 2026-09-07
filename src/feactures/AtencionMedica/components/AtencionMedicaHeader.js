import React from 'react';
import { User, RefreshCw, Cloud, Calendar } from 'lucide-react';
import { formatCapitalize } from '../utils/textFormatter';
import TabNavigation from './TabNavigation';

function AtencionMedicaHeader({ patientData, estadoGuardado, onOpenAgenda, activeTab, setActiveTab }) {
  return (
    <div className="fixed-header-wrapper-hce" style={{ padding: '8px 12px 0 12px' }}>
      {/* TARJETA UNIFICADA: Agrupa Datos del Paciente + Tabs en un solo bloque con el mismo ancho y borde */}
      <div 
        style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '12px', 
          border: '1px solid #e2e8f0', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden'
        }}
      >
        {/* SECCIÓN SUPERIOR: Resumen del Paciente */}
        <div style={{ padding: '10px 14px 8px 14px' }}>
          {patientData.id ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              
              {/* Fila 1: Botón Cambiar + Nombre + Estado Sync */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                  
                  {/* Botón interactivo de usuario */}
                  <button
                    type="button"
                    onClick={onOpenAgenda}
                    title="Cambiar paciente"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      cursor: 'pointer',
                      flexShrink: 0,
                      padding: 0
                    }}
                  >
                    <User size={16} color="#0284c7" strokeWidth={2.5} />
                  </button>

                  {/* Nombre destacado */}
                  <h2 
                    style={{ 
                      margin: 0, 
                      fontSize: '15Spx', 
                      color: '#0f172a', 
                      fontWeight: '750',
                      lineHeight: '1.2',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      wordBreak: 'break-word'
                    }}
                    title={patientData.name}
                  >
                    {formatCapitalize(patientData.name)}
                  </h2>
                </div>

                {/* Indicador de Estado de Sincronización */}
                <div className={`status-cloud-indicator sync-${estadoGuardado}`} style={{ flexShrink: 0 }}>
                  {estadoGuardado === 'saving' && <RefreshCw size={13} className="spinner-sync" color="#2563eb" />}
                  {estadoGuardado === 'saved' && <Cloud size={13} color="#16a34a" />}
                  {estadoGuardado === 'idle' && <Cloud size={13} color="#64748b" />}
                  {estadoGuardado === 'error' && <Cloud size={13} color="#dc2626" />}
                </div>
              </div>

              {/* Fila 2: Etiquetas de información demográfica */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#475569', paddingLeft: '36px' }}>
                <span style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>
                  <strong>Sexo:</strong> {patientData.sex ? formatCapitalize(patientData.sex) : 'N/A'}
                </span>
                <span style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>
                  <strong>Edad:</strong> {patientData.age ? patientData.age : 'N/A'}
                </span>
                <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>
                  HC: {patientData.hc || '---'}
                </span>
              </div>

            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
                Ningún paciente seleccionado
              </h2>
              <button 
                type="button" 
                onClick={onOpenAgenda}
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  padding: '4px 10px', 
                  borderRadius: '5px', 
                  backgroundColor: '#2563eb', 
                  border: 'none', 
                  color: '#ffffff', 
                  fontSize: '11px', 
                  fontWeight: '600', 
                  cursor: 'pointer' 
                }}
              >
                <Calendar size={13} />
                Lista de Citas
              </button>
            </div>
          )}
        </div>

        {/* LÍNEA DIVISORIA DE MÓDULO */}
        <div style={{ borderTop: '1px solid #f1f5f9' }} />

        {/* SECCIÓN INFERIOR: Pestañas con exactamente el mismo ancho */}
        <TabNavigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isDisabled={!patientData?.id}
        />
      </div>
    </div>
  );
}

export default AtencionMedicaHeader;