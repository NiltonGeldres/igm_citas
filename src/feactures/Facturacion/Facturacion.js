import React from "react";
import FacturacionList from "./FacturacionList";
import { CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import {  RefreshCw  } from "lucide-react";
import { ESTILOS_CSS } from '../../apps/medicos-app/styles/ESTILOS_CSS'

const Facturacion = () => {
const [actualizar, setActualizar] = useState(true);  
  const [loading, setLoading] = useState(false);
  return (
    <div className="medico-main-content">
       <style>{ESTILOS_CSS}</style>        
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
      />
    </div>
  );
};

export default Facturacion;

/*
import React from "react";
import FacturacionList from "./FacturacionList";
import { CreditCard } from "lucide-react";

const Facturacion = () => {
  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center gap-3 mb-4 shadow-sm p-3 bg-white rounded-3 text-dark">
        <div className="bg-success p-2 rounded-circle text-white d-flex align-items-center">
          <CreditCard size={24} />
        </div>
        <div>
          <h4 className="mb-0 fw-bold">Verificación de Pagos</h4>
          <p className="text-muted small mb-0">Confirma las transferencias y genera las boletas médicas</p>
        </div>
      </div>
      <FacturacionList />
    </div>
  );
};

export default Facturacion;

*/