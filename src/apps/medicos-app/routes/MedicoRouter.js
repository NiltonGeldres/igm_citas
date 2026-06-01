import { Routes, Route, Navigate } from 'react-router-dom';
import { MedicoLayout } from '../layout/MedicoLayout';
import ProgramacionHorario from '../../../feactures/ProgramacionHorario/ProgramacionHorario';
import { AgendaPage } from '../pages/AgendaPage';
import Facturacion from  '../../../feactures/Facturacion/Facturacion';
import AtencionMedicaForm from '../../../feactures/AtencionMedica/AtencionMedicaForm';

export const MedicoRouter = ({ onLogout }) => {
  return (
    <MedicoLayout  onLogout={onLogout}   >
      <Routes>
        {/*  */}
        <Route path="agenda" element={<AgendaPage />} />
        <Route path="atencion-medica" element={<AtencionMedicaForm />} />

        {/**/}
        <Route path="scheduling" element={<ProgramacionHorario />} />
        <Route path="billing" element={<Facturacion/>} />
        {/*  */}
        <Route path="/" element={<Navigate to="agenda" />} />
        <Route path="*" element={<Navigate to="agenda" />} />
      </Routes>
    </MedicoLayout>
  );
};