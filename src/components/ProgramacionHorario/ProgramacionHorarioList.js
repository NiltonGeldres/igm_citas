
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../Login/services/auth.service";
import ProgramacionHorarioRow from "./ProgramacionHorarioRow";
import ProgramacionHorarioService from "./ProgramacionHorarioService";
import { Button, Col ,Form,Row} from "react-bootstrap";

import Swal from "sweetalert2";
import FormatDate from "../Maestros/FormatDate";
import Turno from "../../Turno/Turno";

//const ProgramacionHorarioList =({month, year,idEspecialidad,idMedico,idServicio,programacion,actualizarProgramacion} )=>{
const ProgramacionHorarioList =({programacion,onModificarProgramacion,onEliminarProgramacion} )=>{

  //const [programacion, setProgramacion] = useState([]];
  const [loading, setLoading]  = useState(false);
  const navigate = useNavigate();
  const [selectDescripcionTurno, setSelectDescripcionTurno ] = useState("");
  const [selectIdTurno, setSelectIdTurno] = useState("");
  const [selectColor, setSelectColor] = useState("");


// Función mensaje de no ingreso de turno 
    const mensajemostrarAlerta=()=>{
      Swal.fire({
        title:"Seleccione el turno <b></b> ",
      })
    }
// Función al seleccionar un horario 
    const handleSelectTurno = (selectedTurno) => {
    if(selectedTurno===0){
      setSelectDescripcionTurno("")
      setSelectIdTurno("")
      setSelectColor("")
    } else {
    setSelectDescripcionTurno(selectedTurno.descripcion)
    setSelectIdTurno(selectedTurno.idTurno)
    setSelectColor(selectedTurno.color)
  }        
    };
// Función eliminar datos del Turno 
    const eliminarRegistro = (id) => {
      onEliminarProgramacion(id)
    }
// Función actualizar datos del Turno 
    const modificarRegistro = (id) => {
      onModificarProgramacion(id)
    };
    


  if (loading) {
    return <h2>Loading...</h2>;
  }  
   return (
     <>
        <br></br>  
        <div className=""  style={{  }}>
            <ul>
            <br></br>    

                <div>
                    {programacion.map(registro=> (
                   <ProgramacionHorarioRow 
                      key={registro.id}
                      row={registro} 
                      onEliminarRegistro={eliminarRegistro} 
                      onModificarRegistro={modificarRegistro} 
                   />                  
                    ))}
                </div>
            </ul> 
        </div>
     </>   
    )
}
export default ProgramacionHorarioList;
