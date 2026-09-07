import { Routes, Route, Navigate } from 'react-router-dom';
import { MedicoLayout } from '../layout/MedicoLayout';
import ProgramacionHorario from '../../../feactures/ProgramacionHorario/ProgramacionHorario';
import { AgendaPage } from '../pages/AgendaPage';
import Facturacion from  '../../../feactures/Facturacion/Facturacion';
import AtencionMedicaForm from '../../../feactures/AtencionMedica/AtencionMedicaForm';
import FirmaDigitalForm from '../../../feactures/FirmaDigital/FirmaDigitalForm';

export const MedicoRouter = ({ onLogout }) => {
  return (
    <MedicoLayout  onLogout={onLogout}   >
      <Routes>
        {/*  */}
         {/*<Route path="agenda" element={<AgendaPage />} />*/}
        <Route path="atencion-medica" element={<AtencionMedicaForm />} />
        <Route path="scheduling" element={<ProgramacionHorario />} />
        <Route path="billing" element={<Facturacion/>} />
        <Route path="firma" element={<FirmaDigitalForm />} />
        {/*  */}
        <Route path="/" element={<Navigate to="atencion-medica" />} />
        <Route path="*" element={<Navigate to="atencion-medica" />} />
      </Routes>
    </MedicoLayout>
  );
};