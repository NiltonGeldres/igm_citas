import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../master-data/services/auth.service";
import CitaSeparadaService from "../../master-data/services/CitaSeparadaService";
import FacturacionRow from "./FacturacionRow";
import { Search, FilterX, Loader2 } from "lucide-react";

const FacturacionList = () => {
  const [citasSeparadas, setCitasSeparadas] = useState([]);
  const [filteredCitas, setFilteredCitas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    CitaSeparadaService.getCitasSeparadasConPagoVirtualXMedicoLeer()
      .then((response) => {
        setCitasSeparadas(response.data);
        setFilteredCitas(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const results = citasSeparadas.filter(cita =>
      cita.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.nrooperacion.toString().includes(searchTerm)
    );
    setFilteredCitas(results);
  }, [searchTerm, citasSeparadas]);

  if (loading) return <div className="loading-state"><Loader2 className="spinner" /></div>;

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
        {filteredCitas.length > 0 ? (
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