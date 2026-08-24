// src/features/AtencionMedica/AtencionMedicaForm.js
import React, { useState } from 'react';
import { TabNavigation } from './components/TabNavigation';

import AtencionMedicaTriajePanel from './components/AtencionMedicaTriajePanel';
import AtencionMedicaAntecedentesPanel from './components/AtencionMedicaAntecedentesPanel';
import AtencionMedicaSintomasPanel from './components/AtencionMedicaSintomasPanel';
import AtencionMedicaExamenFisicoPanel from './components/AtencionMedicaExamenFisicoPanel';
import AtencionMedicaDiagnosticoPanel from './components/AtencionMedicaDiagnosticoPanel';
import AtencionMedicaExamen from './components/AtencionMedicaExamen';
import AtencionMedicaMedicamentoPanel from './components/AtencionMedicaMedicamentoPanel';
import AtencionMedicaAltaPanel from './components/AtencionMedicaAltaPanel';
import AtencionMedicaPdfPanel from './components/AtencionMedicaPdfPanel';

function AtencionMedicaForm({ pacienteSeleccionado, triajeGlobal = [], onNotificarMensaje }) {
  const [activeTab, setActiveTab] = useState('triaje');

  // Estado local simplificado sin mocks ni valores estáticos
  const [atencionData, setAtencionData] = useState({
    triaje: triajeGlobal, // Se toma directo del estado global/prop
    antecedentes: '',
    sintomas: '',
    examenFisico: '',
    diagnosticos: [],
    examenes: [],
    tratamientos: [],
    alta: null
  });

  const handleUpdateSection = (sectionKey, value) => {
    setAtencionData(prev => ({
      ...prev,
      [sectionKey]: value
    }));
  };

  const handleModalMessage = (msg) => {
    if (onNotificarMensaje) {
      onNotificarMensaje(msg);
    } else {
      console.log('Notificación:', msg);
    }
  };

  const medicalRecordDataForPdf = {
    patient: {
      name: pacienteSeleccionado?.nombreCompleto || '',
      hc: pacienteSeleccionado?.numHistoria || '',
      triaje: atencionData.triaje
    },
    attentionDetails: {
      PanelAntecedentes: atencionData.antecedentes,
      PanelSintomas: atencionData.sintomas,
      PanelExamenFisico: atencionData.examenFisico,
      PanelDiagnostico: atencionData.diagnosticos,
      PanelPlanTrabajo: atencionData.examenes,
      PanelTratamientos: atencionData.tratamientos,
      PanelAlta: atencionData.alta
    }
  };

  return (
    <div style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
      
      <TabNavigation 
        activeTab={activeTab} 
        onSelectTab={(tabId) => setActiveTab(tabId)} 
      />

      <div style={{ marginTop: '16px' }}>
        
        {activeTab === 'triaje' && (
          <AtencionMedicaTriajePanel
            content={atencionData.triaje}
            onContentChange={(val) => handleUpdateSection('triaje', val)}
            onModalMessage={handleModalMessage}
            idPacienteSeleccionado={pacienteSeleccionado?.id}
          />
        )}

        {activeTab === 'enfermedad' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <AtencionMedicaAntecedentesPanel
              content={atencionData.antecedentes}
              onContentChange={(val) => handleUpdateSection('antecedentes', val)}
              onModalMessage={handleModalMessage}
            />
            <AtencionMedicaSintomasPanel
              content={atencionData.sintomas}
              onContentChange={(val) => handleUpdateSection('sintomas', val)}
              onModalMessage={handleModalMessage}
            />
            <AtencionMedicaExamenFisicoPanel
              content={atencionData.examenFisico}
              onContentChange={(val) => handleUpdateSection('examenFisico', val)}
              onModalMessage={handleModalMessage}
            />
          </div>
        )}

        {activeTab === 'diagnostico' && (
          <AtencionMedicaDiagnosticoPanel
            content={atencionData.diagnosticos}
            onContentChange={(val) => handleUpdateSection('diagnosticos', val)}
            onModalMessage={handleModalMessage}
          />
        )}

        {activeTab === 'examenes' && (
          <AtencionMedicaExamen
            content={atencionData.examenes}
            onContentChange={(val) => handleUpdateSection('examenes', val)}
            onModalMessage={handleModalMessage}
            diagnosticosDisponibles={atencionData.diagnosticos}
          />
        )}

        {activeTab === 'medicacion' && (
          <AtencionMedicaMedicamentoPanel
            content={atencionData.tratamientos}
            onContentChange={(val) => handleUpdateSection('tratamientos', val)}
            onModalMessage={handleModalMessage}
          />
        )}

        {activeTab === 'alta' && (
          <AtencionMedicaAltaPanel
            content={atencionData.alta}
            onContentChange={(val) => handleUpdateSection('alta', val)}
            onModalMessage={handleModalMessage}
          />
        )}

        {activeTab === 'firma' && (
          <AtencionMedicaPdfPanel
            medicalRecordData={medicalRecordDataForPdf}
          />
        )}

      </div>
    </div>
  );
}

export default AtencionMedicaForm;