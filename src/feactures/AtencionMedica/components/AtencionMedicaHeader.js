import React from 'react';
import { User, Calendar, RefreshCw, Cloud } from 'lucide-react';
import { formatCapitalize } from '../utils/textFormatter';
import TabNavigation from './TabNavigation'; // Revisa la ruta según la carpeta final

function AtencionMedicaHeader({ patientData, estadoGuardado, onOpenAgenda,  activeTab, setActiveTab }) {
  return (
    <div className="fixed-header-wrapper-hce">
      <div className="patient-summary-card-hce">
        {patientData.id ? (
          <div className="patient-title-row-hce">
            <div className="patient-avatar-inline-hce">
              <User size={20} color="#0070da" strokeWidth={2.5} />
            </div>
            <h2 className="patient-summary-name-hce">
              {formatCapitalize(patientData.name)}
            </h2>

            <button 
              type="button" 
              className="btn-change-patient-trigger"
              onClick={onOpenAgenda}
            >
              <Calendar size={14} style={{ marginRight: '4px' }} />
              Cambiar
            </button>

            <div className={`status-cloud-indicator sync-${estadoGuardado}`}>
              {estadoGuardado === 'saving' && <RefreshCw size={14} className="spinner-sync" />}
              {estadoGuardado === 'saved' && <Cloud size={14} className="cloud-success" />}
              {estadoGuardado === 'idle' && <Cloud size={14} className="cloud-idle" />}
              {estadoGuardado === 'error' && <Cloud size={14} className="cloud-error" />}
              <span className="sync-text-label">
                {estadoGuardado === 'saving' && 'Guardando...'}
                {estadoGuardado === 'saved' && 'Sincronizado'}
                {estadoGuardado === 'idle' && 'HCE Sincronizada'}
                {estadoGuardado === 'error' && 'Error de red'}
              </span>
            </div>                  
          </div>
        ) : (
          <div className="patient-title-row-hce empty-patient-header-state">
            <h2 className="patient-summary-name-hce" style={{ color: '#64748b' }}>
              Ningún paciente seleccionado
            </h2>
            <button 
              type="button" 
              className="btn-open-agenda-main"
              onClick={onOpenAgenda}
            >
              <Calendar size={14} style={{ marginRight: '4px' }} />
              Cargar Lista de Citas
            </button>
          </div>
        )}
        
        <div className="patient-metrics-row-hce">
          <div className="patient-metric-block-hce">
            <span className="patient-metric-label-hce">Sexo</span>
            <span className="patient-metric-value-hce">
              {patientData.sex ? formatCapitalize(patientData.sex) : 'N/A'}
            </span>
          </div>
          <div className="patient-metric-block-hce">
            <span className="patient-metric-label-hce">Edad</span>
            <span className="patient-metric-value-hce">
              {patientData.age ? patientData.age : 'Edad'}
            </span>
          </div>
          <div className="patient-metric-block-hce">
            <span className="patient-metric-label-hce">N° Historia</span>
            <span className="patient-metric-value-hce hc-highlight">
              {patientData.hc || '---'}
            </span>
          </div>
        </div>
      </div>

    {/* NAVEGACIÓN INDEPENDIZADA */}
      <TabNavigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isDisabled={!patientData?.id}
      />


    </div>
  );
}

export default AtencionMedicaHeader;


/**
 
      <div className="hce-tabs-navigation-container">
        <div className="hce-tabs-track">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                disabled={!patientData.id}
                onClick={() => setActiveTab(item.id)}
                className={`hce-tab-item ${isActive ? 'is-active' : ''}`}
                style={{ opacity: patientData.id ? 1 : 0.5 }}
              >
                <IconComponent size={16} className="hce-tab-icon" />
                <span className="hce-tab-text">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
 * 
 */

/*
// src/feactures/AtencionMedica/components/AtencionMedicaHeader.js
import React from 'react';
import AtencionMedicaPacienteDatos from '../AtencionMedicaPacienteDatos/AtencionMedicaPacienteDatos';

export const AtencionMedicaHeader = ({ paciente, onEditClick }) => {
  // Validación de seguridad para evitar errores de renderizado
  if (!paciente) return null;

  // Normalización para que coincida con lo que espera AtencionMedicaPacienteDatos (name, id, age, sex)
  const normalizedPatientData = {
    name: paciente.name || paciente.nombres || paciente.nombre || 'Paciente Sin Nombre',
    id: paciente.id || paciente.numHistoria || paciente.hc || 'N/A',
    age: paciente.age || paciente.edad || 'N/A',
    sex: paciente.sex || paciente.sexo || 'N/A'
  };

  return (
    <div className="hce-header-wrapper">
      <AtencionMedicaPacienteDatos 
        patientData={normalizedPatientData} 
        onEditClick={onEditClick} 
      />
      
      <div className="hce-badge-accion" style={{ marginTop: '0.5rem' }}>
        <span className={`badge ${paciente.accionAgenda === 'ACTUALIZAR' ? 'badge-warning' : 'badge-primary'}`}>
          {paciente.accionAgenda === 'ACTUALIZAR' ? 'Modo: Edición de Atención' : 'Modo: Nueva Atención'}
        </span>
      </div>
    </div>
  );
};*/