import React, { useState, useEffect } from 'react';
import ProgramacionHorarioList from './ProgramacionHorarioList';
import { Form,InputGroup,Button,Col, Alert} from 'react-bootstrap';  
import Especialidad from '../Especialidad/Especialidad';
import Medico from '../Medico/Medico';
import Servicio from '../Servicio/Servicio';
import Entidad from '../Entidad/Entidad';
import FormatDate from '../Maestros/FormatDate';
import { useNavigate } from "react-router-dom";
import AuthService from '../Login/services/auth.service';
import ProgramacionHorarioService from './ProgramacionHorarioService';
import Turno from '../../Turno/Turno';
import { AiOutlineSave } from "react-icons/ai";
import { RiSave3Line } from "react-icons/ri";
import MedicoEspecialidad from '../Medico/MedicoEspecialidad';

const ProgramacionHorario = () => {
    const [loading, setLoading]  = useState(false);
    const navigate = useNavigate();
    const [selectedMonth, setSelectedMonth] = useState(''); // Enero por defecto (puedes cambiar según tus necesidades)
    const [selectedYear, setSelectedYear] = useState(''); // Año actual por defecto
//    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()+1); // Año actual por defecto
    const [idEntidad, setIdEntidad] = useState(''); 
    const [idMedico, setIdMedico] = useState('');
    const [idEspecialidad, setIdEspecialidad] = useState(''); 
    const [idServicio, setIdServicio] = useState(""); 
    const [nombreMedico, setNombreMedico] = useState('');
    const [nombreEntidad, setNombreEntidad] = useState(""); 
    const [descripcionEspecialidad, setDescripcionEspecialidad] = useState(""); 
//    const [showErrorEspecialidad, setShowErrorEspecialidad] = useState(false); 
    const [nombreServicio, setNombreServicio] = useState(""); 
    const [precioUnitario, setPrecioUnitario] = useState(0);
    const [programacion, setProgramacion] = useState([]);
    const [selectDescripcionTurno, setSelectDescripcionTurno ] = useState("");
    const [selectIdTurno, setSelectIdTurno] = useState("");
    const [selectColor, setSelectColor] = useState("");    
    const [showError, setShowError]    = useState(false)
    const [mensajeError, setMensajeError]    = useState("")
    const [show, setShow] = useState(false);

 useEffect(() => {
        if(selectedMonth>0 && selectedYear >0 && idEspecialidad>0 && idMedico>0 )
        LoadData() ;
}, [selectedMonth,selectedYear]);

    const handleMonthChange = (e) => {

        if(e.target.value===''){
            setSelectedMonth('');
        }  else {
           setSelectedMonth(parseInt(e.target.value, 10));
        }


    };
    const handleYearChange = (e) => {
        if(e.target.value===''){
            setSelectedYear('');
        }  else {
            setSelectedYear(parseInt(e.target.value, 10));
        }

    };
 /*parametros especialidad */
    const valueEspecialidad = val => {
      setIdEspecialidad(val); setIdMedico('') ;
    }
    const textEspecialidad = txt => {
     setDescripcionEspecialidad(txt);
    }
/* parametro de Medicos  */
    const valueMedico = val => { 
    setIdMedico(val); 
    }
    const textMedico = txt => { 
    setNombreMedico(txt);
    }
    const precioUnitarioSel = val => {
      setPrecioUnitario(val) 
    }
/* parametro de Servicio  */
    const valueServicio = val => { 
    setIdServicio(val); 
    }
    const textServicio = txt => { 
    setNombreServicio(txt);
    }
/* parametro de Entidad  */
    const valueEntidad = val => { 
    console.log("ID ENTIDAD VAL "+val)
    setIdEntidad(val); 
    }
    const textEntidad = txt => { 
    setNombreEntidad(txt);
    }
// Función para guardar programacion , envia a API
    const guardarProgramacion = () => {
        const todosCero = programacion.every(registro => registro.idTurno === 0);
        console.log("ceros   "+todosCero)
        if (todosCero) {
            setMensajeError('Programacion sin turnos')
            setShowError(true)
        } 
        if (programacion.length === 0) {
            setMensajeError('Programacion vacia')
            setShowError(true)
        } 
        if (selectedYear === '') {
            setMensajeError('No ha seleccionado Año')
            setShowError(true)
        } 
        if (selectedMonth === '') {
            setMensajeError('No ha seleccionado Mes')
            setShowError(true)
        } 
        if (idServicio === '') {
            setMensajeError('No ha seleccionado Servicio')
            setShowError(true)
        } 
        if (idMedico === '') {
            setMensajeError('No ha seleccionado Medico')
            setShowError(true)
        } 
        if (idEspecialidad=== '') {
            setMensajeError('No ha seleccionado Especialidad')
            setShowError(true)
        } 
        if (idEntidad === '') {
            setMensajeError('No ha seleccionado Entidad')
            setShowError(true)
        } 
          if (show) {
            return;
          } else {
            console.log("SETSHOW   "+show)
            let d = new Date()
            let fecha = FormatDate.format_ddmmyyyy(d)
            setLoading(true);
            ProgramacionHorarioService.setProgramacionCrear(fecha, idEspecialidad,idMedico,programacion,idServicio)
            .then((response) => {
                    LoadData()
                    console.log("DATA RETORNO citaSeparada :  "+JSON.stringify(response.data))
                setLoading(false);
                },(error) => {
                console.log("Error creando la programacion ");
                setLoading(false);
                AuthService.logout();
                navigate("/login");
                window.location.reload();
                });      
            }        
     };

// Función para generar una data de programaciones existente , consume API
    const LoadData = ()=>{

        setLoading(true);
        ProgramacionHorarioService.getProgramacionMedicoMes(selectedMonth,selectedYear,idEspecialidad,idMedico)
        .then((response) => {
            if(response.data.programacionMedicaDiaResponse!==undefined ){
                console.log("ENCONTRADO "+JSON.stringify(response.data.programacionMedicaDiaResponse));
                setProgramacion(response.data.programacionMedicaDiaResponse);
            } else {
                console.log("VACIO");
                setProgramacion([]);
            }
            setLoading(false);
        },(error) => {
            setLoading(false);
            setProgramacion([]);
            alert.log("ProgramacionHorario  Error page", error.response);
            if (error.response && error.response.status === 403) {
                AuthService.logout();
                navigate("/login");
                window.location.reload();
            }
        });
    };
// Función para generar una data de programaciones en blaco, consume API
    const LoadDataBlanco = ()=>{
    setLoading(true);
    ProgramacionHorarioService.getProgramacionMedicoMesBlanco(selectedMonth,selectedYear,idEspecialidad,idMedico)
    .then((response) => {
        console.log(JSON.stringify(response.data.programacionMedicaDiaResponse));
        if(response.data.programacionMedicaDiaResponse!=undefined ){
                console.log("ENCONTRADO");
                setProgramacion(response.data.programacionMedicaDiaResponse);
        } else {
            console.log("VACIO");
            setProgramacion([]);
        }
        setLoading(false);
    },(error) => {
        setLoading(false);
        setProgramacion([]);
        alert.log("ProgramacionHorario  Error page", error.response);
        if (error.response && error.response.status === 403) {
            AuthService.logout();
            navigate("/login");
            window.location.reload();
        }
    });
    };
// Función eliminar datos del Turno 
    const onEliminarProgramacion = (id) => {
        setProgramacion(prevProgramaciones => 
            prevProgramaciones.map(row => 
              row.id === id
                ? { ...row,
                   descripcionTurno :"" ,
                   idTurno : 0 }
                : row
            )
          );  
    }
// Función actualizar datos del Turno 
    const onModificarProgramacion = (id) => {
        if(selectIdTurno==="") {
       //     mensajemostrarAlerta()
        } else {
                setProgramacion(prevProgramaciones => 
                  prevProgramaciones.map(row => 
                  row.id === id
                    ? { ...row, 
                            color: selectColor ,
                            idTurno: selectIdTurno ,
                              descripcionTurno: selectDescripcionTurno}
                    : row
                )
              );
        }
    };

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
    
    
    return (
        <>
            <div className='mb-1' style={{width:400}}> 
                <Button 
                        variant="success"
                        onClick={() => guardarProgramacion()} >
                    <RiSave3Line  size={22} />                    
                </Button>
            </div>    
                    <div className='mb-1' style={{width:400}}>
                        <Alert  key= {'danger'} 
                                variant={"danger"}
                                show={showError}
                                onClose={() => setShowError(false)} dismissible>
                            {mensajeError}
                        </Alert>
                    </div>    

            <div className='mb-1' style={{width:400}}>
                        <Entidad
                            valueEntidad = {valueEntidad}
                            textEntidad= {textEntidad}
                            />
            </div>           
            <div className='mb-1' style={{width:400}}>
                 <Especialidad
                        valueEspecialidad={valueEspecialidad}
                        textEspecialidad={textEspecialidad}
                    />
            </div>           
            <div className='mb-1' style={{width:400}}>
                    <MedicoEspecialidad
                        idEspecialidad ={idEspecialidad}
                        valueMedico = {valueMedico}
                        textMedico= {textMedico}
                        precioUnitario= {precioUnitarioSel}/>
            </div>           
            <div className='mb-1' style={{width:400}}>
                    <Servicio    
                        idEntidad = {idEntidad}
                        valueServicio  = {valueServicio}
                        textServicio   = {textServicio}
                    />
            </div>           
            <div className='mb-1' style={{width:400}}>
                 <InputGroup className="">
                    <Form.Select id="month" value={selectedMonth} onChange={handleMonthChange}>
                        <option key={''} value={''}>
                            {"Mes"}
                        </option>
                        {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                        <option key={month} value={month}>
                            {new Date(2022, month - 1, 1).toLocaleString('es-ES', { month: 'long' }).toUpperCase()}
                        </option>
                        ))}
                    </Form.Select>
                    
                    <Form.Select id="year" value={selectedYear} onChange={handleYearChange}>
                        <option key={''} value={''}>
                            {"Año"}
                        </option>                        
                        {Array.from({ length: 20 }, (_, index) => new Date().getFullYear() - 5 + index).map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                        ))}
                    </Form.Select>
                </InputGroup>
            </div> 
            <div className='mb-1' style={{width:400}}>
                <Col className=''>
                        <Turno       
                           handleSelectTurno ={handleSelectTurno}/>
                </Col>            
            </div> 
            { programacion.length!==0  ?
               <div style={{}}> 
                    <ProgramacionHorarioList 
                        programacion={programacion}
                        onModificarProgramacion={onModificarProgramacion}
                        onEliminarProgramacion={onEliminarProgramacion}
                    />
               </div> 
               : 
               <center><h4 >Programacion no creada...</h4> 
               <Button  
                    variant="success"
                    onClick={() => LoadDataBlanco()}>
                   Agregar Programacion
               </Button>
               </center>     
            }                 

    </>
     );
};

export default ProgramacionHorario;
/**
                         month={selectedMonth}
                        year={selectedYear}  
                        idEspecialidad={idEspecialidad}
                        idMedico={idMedico}
                        idServicio={idServicio}

 * 
 */


//         <ProgramacionHorarioList month={selectedMonth} year={selectedYear}  ></ProgramacionHorarioList>
//<FormLabel>Precio: {precioUnitario}</FormLabel>                  



/**
 * 
 *          <Col className='col-2'>
                <Servicio    
                    idEntidad ={idEspecialidad}
                    idEspecialidad ={idEntidad}
                    valueServicio = {valueServicio}
                    textServicio= {textServicio}
                />
            </Col>
 */

            /**
             * 
             *                     <Form.Label htmlFor="year">Año:</Form.Label>

             */



            /**
             * 
        


                <Col >
                    <Form.Label htmlFor="month">Mes:</Form.Label>
                    </Col>
                    <Col >
                    <Form.Select id="month" value={selectedMonth} onChange={handleMonthChange}>
                        {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                        <option key={month} value={month}>
                            {new Date(2022, month - 1, 1).toLocaleString('es-ES', { month: 'long' }).toUpperCase()}
                        </option>
                        ))}
                    </Form.Select>
                </Col>
      
                <Col>
                    <Form.Select id="year" value={selectedYear} onChange={handleYearChange}>
                        {Array.from({ length: 20 }, (_, index) => new Date().getFullYear() - 5 + index).map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                        ))}
                    </Form.Select>
                </Col>            

             * 
             * 
             */


/**

  if (programacion.length === 0) {
    return <>
    <br></br>
    <br></br>
   <center><h4 >Programacion no creada...</h4> 
    <Button  onClick={() => LoadDataBlanco()}>
        Agregar Programacion
    </Button>
    </center>     
    </>     
    
  } 
 *  */                