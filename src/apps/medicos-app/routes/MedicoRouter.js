// src/apps/medico-app/routes/MedicoRouter.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { MedicoLayout } from '../components/layout/MedicoLayout';
import { AgendaPage } from '../pages/AgendaPage';
import ProgramacionHorario from '../../../feactures/ProgramacionHorario/ProgramacionHorario';

export const MedicoRouter = () => {
    
    alert("MedicoRouter")
  return (
    <MedicoLayout>
      <Routes>
        {/* Ruta para la Agenda */}
        <Route path="agenda" element={<AgendaPage />} />
        
        {/* Ruta para la Programación (La que acabas de pasar) */}
        <Route path="scheduling" element={<ProgramacionHorario />} />
        
        {/* Ruta para Facturación (Pendiente) */}
        <Route path="billing" element={<div style={{padding: '20px'}}>Panel de Facturación</div>} />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="agenda" />} />
      </Routes>
    </MedicoLayout>
  );
};