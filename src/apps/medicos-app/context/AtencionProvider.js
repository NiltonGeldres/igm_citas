// src/apps/medicos-app/context/AtencionContext.jsx
import React, { createContext, useContext } from 'react';
import { useAtencionMedica } from '../../../feactures/AtencionMedica/hooks/useAtencionMedica';
const AtencionContext = createContext(null);

export const AtencionProvider = ({ children }) => {
  // El hook vive en la memoria de este Provider
  const atencionState = useAtencionMedica();

  return (
    <AtencionContext.Provider value={atencionState}>
      {children}
    </AtencionContext.Provider>
  );
};

export const useAtencionContext = () => {
  const context = useContext(AtencionContext);
  if (!context) {
    throw new Error("useAtencionContext debe usarse dentro de un AtencionProvider");
  }
  return context;
};