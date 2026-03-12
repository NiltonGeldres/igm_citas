import React from "react";
import AuthService from "./Login/services/auth.service";
import CitaV2 from "./Cita/CitaV2";
import { MedicoRouter } from "../apps/medicos-app/routes/MedicoRouter";

const Private = () => {
  const Authority = AuthService.getCurrentAuthority();

  return (
    <>
      {/* Si es Médico: Cargamos su Router que ya trae el Layout y Footer */}
      {Authority === 'Medicos' && (
        <MedicoRouter />
      )}

      {/* Si es Usuarios (Paciente): Aquí puedes poner tu CitaV2 o su propio Router */}
      {Authority === 'Usuarios' && (
        <div className="paciente-container">
           {/* Por ahora mantienes lo que tenías, o creas un PacienteRouter */}
           <CitaV2 />
        </div>
      )}
    </>
  );
};

export default Private;