import { Routes, Route, Navigate } from 'react-router-dom';
import { MedicoLayout } from '../layout/MedicoLayout';
import ProgramacionHorario from '../../../feactures/ProgramacionHorario/ProgramacionHorario';
import { AgendaPage } from '../pages/AgendaPage';
import Facturacion from '../../../feactures/Facturacion/Facturacion';

export const MedicoRouter = ({ onLogout }) => {
  return (
    <MedicoLayout  onLogout={onLogout}   >
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