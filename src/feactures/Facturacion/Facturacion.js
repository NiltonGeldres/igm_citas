import React, { useState } from "react";
import FacturacionList from "./FacturacionList";
import { CreditCard, RefreshCw } from "lucide-react";

const Facturacion = () => {
  const [actualizar, setActualizar] = useState(true);  
  const [loading, setLoading] = useState(false);

  return (
    <div className="medico-main-content">
      <div className="header-seccion-pago">
        <div className="icono-pago">
          <CreditCard size={24} />
        </div>
        <div className="texto-pago">
          <h4 className="titulo-pago">Verificación de Pagos</h4>
          <p className="subtitulo-pago">Confirma transferencias y gestiona citas separadas</p>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <button 
            className="btn btn-light shadow-sm rounded-circle p-2 border-0"
            onClick={() => setActualizar(true)}
            disabled={loading}
          >
            <RefreshCw className={loading ? 'animate-spin text-primary' : 'text-primary'} size={20} />
          </button>
        </div>
      </div>

      {/* Enviamos el disparador de actualización al único listado */}
      <FacturacionList 
        actualizar={actualizar}
        setActualizar={setActualizar}
        setLoading={setLoading} 
        loading={loading}
      />
    </div>
  );
};

export default Facturacion;

/*

import React from "react";
import FacturacionList from "./FacturacionList";
import { CreditCard } from "lucide-react";
import {  useState } from "react";
import {  RefreshCw  } from "lucide-react";
//import { ESTILOS_CSS } from '../../apps/medicos-app/styles/ESTILOS_CSS'

const Facturacion = () => {
const [actualizar, setActualizar] = useState(true);  
  const [loading, setLoading] = useState(false);
  return (
    <div className="medico-main-content">
      <div className="header-seccion-pago">
        <div className="icono-pago">
          <CreditCard size={24} />
        </div>
        <div className="texto-pago">
          <h4 className="titulo-pago">Verificación de Pagos</h4>
          <p className="subtitulo-pago">Confirma transferencias y genera boletas</p>
          
        </div>
            <div className="d-flex justify-content-between align-items-center  ">
                <button 
                className="btn btn-light shadow-sm rounded-circle p-2 border-0"
                onClick={() => setActualizar(true)}
                disabled={loading}
              >
                <RefreshCw className={loading ? 'animate-spin text-primary' : 'text-primary'} size={20} />
              </button>
            </div>

      </div>
      <FacturacionList 
        actualizar = {actualizar }
        setLoading={setLoading} 
        loading={loading}
      />
    </div>
  );
};

export default Facturacion;
*/
