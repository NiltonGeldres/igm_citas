import React, { useState, useEffect } from "react";
import CitaSeparadaService from "../CitaSeparada/CitaSeparadaService";
import FacturacionRow from "./FacturacionRow";
import { Search, FilterX, Loader2 } from "lucide-react";

const FacturacionList = ({ actualizar, setActualizar, setLoading, loading }) => {
  const [universoCitas, setUniversoCitas] = useState([]);
  const [filteredCitas, setFilteredCitas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    if (!actualizar) return;
    
    setLoading(true);
    CitaSeparadaService.getCitasSeparadasConPagoVirtualXMedicoLeer()
      .then((response) => {
        if (response && response.data) {
          setUniversoCitas(response.data);
          setFilteredCitas(response.data);
        }
      })
      .catch((error) => console.error("Error cargando la lista unificada:", error))
      .finally(() => {
        setLoading(false);
        setActualizar(false);
      });
  }, [actualizar, setLoading, setActualizar]);

  // El buscador ahora filtra todo el universo de citas (por nombre o si existe nrooperacion)
  useEffect(() => {
    const results = universoCitas.filter(cita => {
      const coincideNombre = cita.nombres?.toLowerCase().includes(searchTerm.toLowerCase());
      const coincideOperacion = cita.nrooperacion ? cita.nrooperacion.toString().includes(searchTerm) : false;
      return coincideNombre || coincideOperacion;
    });
    setFilteredCitas(results);
  }, [searchTerm, universoCitas]);

  return (
    <div className="facturacion-list-container">

      {/* BUSCADOR ÚNICO */}
      <div className="search-box mb-4">
        <Search size={18} className="search-icon" />
        <input 
          type="text"
          placeholder="Buscar paciente por nombre o Nro. Operación..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* LISTADO DE TARJETAS UNIFICADO */}
      <div className="rows-container">
        {loading ? (
          <div className="loading-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px' }}>
            <Loader2 className="spinner text-primary animate-spin" size={40} />
            <p className="mt-2 text-muted">Cargando registros médicos...</p>
          </div>
        ) : filteredCitas.length > 0 ? (
          filteredCitas.map((rows) => (
            <FacturacionRow key={rows.idcitaseparada} rows={rows} />
          ))          
        ) : (
          <div className="empty-state text-center p-5">
            <FilterX size={48} className="text-muted mb-2 d-inline-block" />
            <p className="text-muted">No se encontraron citas separadas pendientes.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacturacionList;


/*

import React, { useState, useEffect } from "react";
//import CitaSeparadaService from "../../master-data/services/CitaSeparadaService";
import CitaSeparadaService from "../CitaSeparada/CitaSeparadaService";
import FacturacionRow from "./FacturacionRow";
import { Search, FilterX, Loader2 } from "lucide-react";

const FacturacionList = ({actualizar,setLoading,loading }) => {
  const [citasSeparadas, setCitasSeparadas] = useState([]);
  const [filteredCitas, setFilteredCitas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  //const [loading, setLoading] = useState(false);
  //const navigate = useNavigate();
  
  useEffect(() => {
    setLoading(true);
    CitaSeparadaService.getCitasSeparadasConPagoVirtualXMedicoLeer()
      .then((response) => {
        setCitasSeparadas(response.data);
        setFilteredCitas(response.data);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false)); 
  }, [actualizar,setLoading]);

  useEffect(() => {
    const results = citasSeparadas.filter(cita =>
      cita.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.nrooperacion.toString().includes(searchTerm)
    );
    setFilteredCitas(results);
  }, [searchTerm, citasSeparadas]);


  return (
    <div className="facturacion-list-container">


      
      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input 
          type="text"
          placeholder="Buscar paciente o Nro. Operación..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      
      <div className="rows-container">

      {loading ? (
        <div className="loading-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px' }}>
          <Loader2 className="spinner text-primary animate-spin" size={40} />
          <p className="mt-2 text-muted">Cargando registros...</p>
        </div>
      ) : filteredCitas.length > 0 ? (
        filteredCitas.map((rows) => (
          <FacturacionRow key={rows.idcitaseparada} rows={rows} />
        ))          
        ) : (
          <div className="empty-state">
            <FilterX size={48} />
            <p>No se encontraron resultados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacturacionList;
*/


/**
 * 
 *         {filteredCitas.length > 0 ? (
          filteredCitas.map((rows) => (
            <FacturacionRow key={rows.idcitaseparada} rows={rows} />
          ))

 */