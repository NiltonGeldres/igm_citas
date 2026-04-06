import { Routes, Route, Navigate } from 'react-router-dom';
import { MedicoLayout } from '../layout/MedicoLayout';
import ProgramacionHorario from '../../../feactures/ProgramacionHorario/ProgramacionHorario';
import { PacientePage } from '../pages/PacientePage';
import Facturacion from '../../../feactures/Facturacion/Facturacion';

export const PacienteRouter = ({ onLogout }) => {
  return (
    <PacienteLayout  onLogout={onLogout}   >
      <Routes>
        {/* No pongas /med/ aquí, porque ya viene del padre */}
        <Route path="inicio" element={<PacientePage />} />
        
        {/* Asegúrate que diga "scheduling" (como en el footer) */}
        <Route path="citas" element={<Citas/>} />
        
        <Route path="Pagos" element={<Facturacion/>} />

        {/* Si la URL es solo /med, redirige a /med/agenda */}
        <Route path="/" element={<Navigate to="inicio" />} />
        
        {/* Si ponen cualquier otra cosa mal escrita después de /med/ */}
        <Route path="*" element={<Navigate to="inicio" />} />
      </Routes>
    </PacienteLayout>
  );
};

