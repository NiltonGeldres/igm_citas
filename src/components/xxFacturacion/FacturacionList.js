import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../Login/services/auth.service";
import CitaSeparadaService from "../CitaSeparada/CitaSeparadaService";
import FacturacionRow from "./FacturacionRow";
import { Spinner, InputGroup, Form } from "react-bootstrap";
import { Search, FilterX } from "lucide-react"; // Íconos para el buscador

const FacturacionList = () => {
  const [citasSeparadas, setCitasSeparadas] = useState([]);
  const [filteredCitas, setFilteredCitas] = useState([]); // Estado para los resultados filtrados
  const [searchTerm, setSearchTerm] = useState("");      // Estado para el texto del buscador
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const LoadData = () => {
      setLoading(true);
      CitaSeparadaService.getCitasSeparadasConPagoVirtualXMedicoLeer()
        .then((response) => {
          setCitasSeparadas(response.data);
          setFilteredCitas(response.data); // Inicialmente mostramos todo
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error en facturación:", error);
          if (error.response?.status === 403) {
            AuthService.logout();
            navigate("/login");
          }
          setLoading(false);
        });
    };
    LoadData();
  }, [navigate]);

  // Lógica de filtrado en tiempo real
  useEffect(() => {
    const results = citasSeparadas.filter(cita =>
      cita.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.nrooperacion.toString().includes(searchTerm)
    );
    setFilteredCitas(results);
  }, [searchTerm, citasSeparadas]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      
      {/* BUSCADOR */}
      <InputGroup className="mb-3 shadow-sm">
        <InputGroup.Text className="bg-white border-end-0">
          <Search size={18} className="text-muted" />
        </InputGroup.Text>
        <Form.Control
          placeholder="Buscar por paciente o Nro. de operación..."
          className="border-start-0 ps-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ boxShadow: 'none' }}
        />
      </InputGroup>

      {/* LISTADO */}
      {filteredCitas.length > 0 ? (
        filteredCitas.map((rows) => (
          <FacturacionRow key={rows.idcitaseparada} rows={rows} />
        ))
      ) : (
        <div className="text-center p-5 bg-light rounded-3 text-muted border border-dashed">
          <FilterX size={48} className="mb-2 opacity-25" />
          <p>No se encontraron pagos con "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default FacturacionList;

