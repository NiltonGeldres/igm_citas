// src/apps/medico-app/routes/MedicoRouter.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { MedicoLayout } from '../components/layout/MedicoLayout';
//import { AgendaPage } from '../pages/AgendaPage';
import ProgramacionHorario from '../../../feactures/ProgramacionHorario/ProgramacionHorario';
import { AgendaPage } from '../components/layout/AgendaPage';
import Facturacion from '../../../feactures/Facturacion/Facturacion';

export const MedicoRouter = () => {
  return (
    <MedicoLayout>
      <Routes>
        {/* No pongas /med/ aquí, porque ya viene del padre */}
        <Route path="agenda" element={<AgendaPage />} />
        
        {/* Asegúrate que diga "scheduling" (como en el footer) */}
        <Route path="scheduling" element={<ProgramacionHorario />} />
        
        <Route path="billing" element={<Facturacion/>} />

        {/* Si la URL es solo /med, redirige a /med/agenda */}
        <Route path="/" element={<Navigate to="agenda" />} />
        
        {/* Si ponen cualquier otra cosa mal escrita después de /med/ */}
        <Route path="*" element={<Navigate to="agenda" />} />
      </Routes>
    </MedicoLayout>
  );
};