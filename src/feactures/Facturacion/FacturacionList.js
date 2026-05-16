import React, { useState, useEffect } from "react";
import CitaSeparadaService from "../../master-data/services/CitaSeparadaService";
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


      {/* BUSCADOR */}
      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input 
          type="text"
          placeholder="Buscar paciente o Nro. Operación..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* LISTADO */}
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

/**
 * 
 *         {filteredCitas.length > 0 ? (
          filteredCitas.map((rows) => (
            <FacturacionRow key={rows.idcitaseparada} rows={rows} />
          ))

 */