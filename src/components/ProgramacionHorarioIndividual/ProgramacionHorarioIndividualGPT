// src/components/ProgramacionHorarioIndividual.jsx
import React, { useState, useEffect } from "react";
import { Form, InputGroup, Button, Col, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";


const ProgramacionHorarioIndividual = () => {
const years = [2024, 2025, 2026];
const months = [
"Enero","Febrero","Marzo","Abril","Mayo","Junio",
"Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];


const [consultorio, setConsultorio] = useState("Consultorio 101");
const [year, setYear] = useState(2025);
const [month, setMonth] = useState("Abril");
const [selectedDay, setSelectedDay] = useState(null);
const [horarios, setHorarios] = useState({});


const daysInMonth = 30;


const handleDayClick = (day) => setSelectedDay(day);


const handleAddHorario = () => {
const newHorario = prompt("Ingrese un horario (Ej: 08:00 - 12:00)");
if (!newHorario) return;


setHorarios((prev) => ({
...prev,
[selectedDay]: [...(prev[selectedDay] || []), newHorario]
}));
};


return (


<div className="container py-4" style={{ maxWidth: "900px" }}>
    <h3 className="fw-bold mb-4">Programación Médica</h3>
    <div className="row g-3 mb-4">
        <Col md={4}>
              <Form.Label>Consultorio</Form.Label>
                <Form.Select value={consultorio} onChange={(e) => setConsultorio(e.target.value)}>
                  <option>Consultorio 101</option>
                  <option>Consultorio 102</option>
                  <option>Consultorio 103</option>
                </Form.Select>
        </Col>

        <Col md={4}>
          <Form.Label>Año</Form.Label>
          <Form.Select value={year} onChange={(e) => setYear(e.target.value)}>
            {years.map((y) => (
            <option key={y}>{y}</option>
            ))}
          </Form.Select>
        </Col>


        <Col md={4}>
          <Form.Label>Mes</Form.Label>
          <Form.Select value={month} onChange={(e) => setMonth(e.target.value)}>
            {months.map((m) => (
            <option key={m}>{m}</option>
            ))}
          </Form.Select>
        </Col>
    </div>

    <h5 className="text-center mb-3 fw-semibold">{month}</h5>
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle">
                <thead className="table-light">
                  <tr> {["D", "L", "M", "M", "J", "V", "S"].map((d) => ( <th key={d}>{d}</th>     ))}    </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, row) => (
                      <tr key={row}>
                        {Array.from({ length: 7 }).map((_, col) => {
                              const day = row * 7 + col + 1;
                              if (day > daysInMonth) 
                                return <td key={col}></td>;
                                  const isSelected = selectedDay === day;
                                  const hasHorarios = horarios[day]?.length > 0;
                                return ( 
                                    <td   key={col}
                                          className={`p-3 rounded position-relative ${isSelected ? "bg-primary text-white" : ""}`}
                                          style={{ cursor: "pointer" }}
                                          onClick={() => handleDayClick(day)}
                                    >
                                        <div>{day}</div>
                                        {hasHorarios && (
                                        <small className="text-success">{horarios[day].length} horarios</small>
                                        )}
                                    </td>
                                );
                        })}
                    </tr>
                ))}
              </tbody>
        </table>
      </div>
        {selectedDay && (
              <div className="text-center mb-3">
                  <Button variant="outline-primary" onClick={handleAddHorario}>
                        Agregar horario al día {selectedDay}
                  </Button>
              </div>
        )}


        <div className="text-center mt-4">
            <Button variant="primary" className="px-4 py-2">
                Guardar programación
            </Button>
        </div>
</div>
);
};

export default ProgramacionHorarioIndividual;