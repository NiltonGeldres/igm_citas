
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../Login/services/auth.service";
import CitaSeparadaService from "../CitaSeparada/CitaSeparadaService";
import FacturacionRow from "./FacturacionRow";

 const FacturacionList = () => {
    const [citasSeparadas, setCitasSeparadas] = useState([]);
//    const [citas, setCitas] = useState([]);
    const [loading, setLoading]  = useState(false);
    const navigate = useNavigate();
//    let usuario = "";
    useEffect(() => {
        const LoadData = ()=>{
                setLoading(true);
                CitaSeparadaService.getCitasSeparadasConPagoVirtualXMedicoLeer()
                .then((response) => {
                    setCitasSeparadas(response.data);
                    console.log(JSON.stringify(response.data));
                     setLoading(false);
                },(error) => {
                    alert.log("Citas separadas para facturacion Error page", error.response);
                    if (error.response && error.response.status === 403) {
                        AuthService.logout();
                        navigate("/login");
                        window.location.reload();
                    }
                });
        };
        LoadData() ;
    }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }      
  return (
    <div className="">
        <ul>
           {citasSeparadas.map(rows=> (
            <FacturacionRow rows={rows}   />
            
            ))}
    </ul>            
    </div>
  );
}

export default FacturacionList;

