import React from 'react';
import { User, RefreshCw, Cloud, Calendar } from 'lucide-react';
import { formatCapitalize } from '../utils/textFormatter';
import TabNavigation from './TabNavigation';

function AtencionMedicaHeader({ patientData, estadoGuardado, onOpenAgenda, activeTab, setActiveTab }) {
 console.log("DATA DEL PACIENTE:   "+JSON.stringify(patientData)) 
  return (
    <div className="fixed-header-wrapper-hce" style={{ padding: '8px 12px 0 12px' }}>
      {/* TARJETA UNIFICADA */}
      <div 
        style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '12px', 
          border: '1px solid #e2e8f0', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
          overflow: 'hidden'
        }}
      >
        {/* SECCIÓN SUPERIOR: Resumen del Paciente */}
        <div style={{ padding: '12px 16px' }}>
          {patientData?.id ? (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              
              {/* Botón Avatar de Usuario (Más grande) */}
              <button
                type="button"
                onClick={onOpenAgenda}
                title="Cambiar paciente"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  cursor: 'pointer',
                  flexShrink: 0,
                  padding: 0,
                  marginTop: '2px',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <User size={20} color="#0284c7" strokeWidth={2.2} />
              </button>

              {/* Información Central del Paciente */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                
                {/* Nombre y Estado Sync */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <h2 
                    style={{ 
                      margin: 0, 
                      fontSize: '16px', 
                      color: '#0f172a', 
                      fontWeight: '700',
                      lineHeight: '1.25',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={patientData.name}
                  >
                    {formatCapitalize(patientData.name)}
                  </h2>

                  {/* Estado de Sincronización */}
                  <div className={`status-cloud-indicator sync-${estadoGuardado}`} style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    {estadoGuardado === 'saving' && <RefreshCw size={15} className="spinner-sync" color="#2563eb" />}
                    {estadoGuardado === 'saved' && <Cloud size={15} color="#16a34a" />}
                    {estadoGuardado === 'idle' && <Cloud size={15} color="#64748b" />}
                    {estadoGuardado === 'error' && <Cloud size={15} color="#dc2626" />}
                  </div>
                </div>

                {/* Etiquetas Demográficas más Visibles */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '5px', fontSize: '12px', fontWeight: '500' }}>
                    <strong>Nro Atencion:</strong> {patientData.idAtencion ? patientData.idAtencion : 'N/A'}
                  </span>
                  <span style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '5px', fontSize: '12px', fontWeight: '500' }}>
                    <strong>Sexo:</strong> {patientData.sexo ? formatCapitalize(patientData.sexo) : 'N/A'}
                  </span>
                  <span style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '5px', fontSize: '12px', fontWeight: '500' }}>
                    <strong>Edad:</strong> {patientData.edad ? patientData.edad : 'N/A'}
                  </span>
                  <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: '5px', fontSize: '12px', fontWeight: '700', border: '1px solid #dbeafe' }}>
                    HC: {patientData.hc || '---'}
                  </span>
                </div>

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
                  backgroundColor: '#2563eb', 
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

        {/* LÍNEA DIVISORIA */}
        <div style={{ borderTop: '1px solid #f1f5f9' }} />

        {/* SECCIÓN INFERIOR: Pestañas de Navegación */}
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