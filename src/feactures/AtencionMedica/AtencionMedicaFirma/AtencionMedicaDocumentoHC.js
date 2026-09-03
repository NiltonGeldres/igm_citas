import React from 'react';
import AtencionMedicaFirmaPanel from './AtencionMedicaFirmaPanel';

export const AtencionMedicaDocumentoHC = ({ fullMedicalRecord, showModalMessage }) => {
  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '12px' }}>
      <AtencionMedicaFirmaPanel
        medicalRecordData={fullMedicalRecord}
        onModalMessage={showModalMessage}
      />
    </div>
  );
};