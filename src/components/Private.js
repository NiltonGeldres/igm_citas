import React from "react";
import AuthService from "./Login/services/auth.service";
import MenuTab1 from "./MenuTab/MenuTab1"; // Asumo que este es el menú para 'Usuarios'
import MenuTab2 from "./MenuTab/MenuTab2"; // El menú de iconos para 'Medicos'

// Obtiene la autoridad (rol) del usuario actual
let Authority = AuthService.getCurrentAuthority()

const Private = () => {
  return (
    <div >
      {/* Si la autoridad es 'Usuarios', muestra MenuTab1 */}
      { Authority === 'Usuarios' && (
        <MenuTab1 />
      )}

      {/* Si la autoridad es 'Medicos', muestra MenuTab2 (el dashboard de iconos) */}
      { Authority === 'Medicos' && (
        <MenuTab2 />
      )}
    </div>
  );
};
export default Private;


/*
import React from "react";
//import HistoriaClinicaSolicitadaContainer from "./HistoriaClinicaSolicitadaContainer/HistoriaClinicaSolicitadaContainer";
import AuthService from "./Login/services/auth.service";
import MenuTab1 from "./MenuTab/MenuTab1";
import MenuTab2 from "./MenuTab/MenuTab2";

let Authority = AuthService.getCurrentAuthority()
//alert ("Authority==>> "+Authority)
const Private = () => {
  return (
    <div >
      {  Authority==='Usuarios' && (
        <MenuTab1 />
      )}

      {  Authority==='Medicos' && (
        <MenuTab2 />
      )}
    </div>
  );
};
export default Private;

*/