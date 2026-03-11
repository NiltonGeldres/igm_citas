import  { useState} from 'react';
import { SHIFTS_DATA } from "../Data/Data";
import { Icono } from "./Icono";
//import {TODOS_LOS_TURNOS} from "../Constants/TODOS_LOS_TURNOS"
import { obtenerListaTurnos } from '../Constants/TODOS_LOS_TURNOS';
import Servicio from '../../../../shared/components/Servicio';


const ProgramadorMasivo = ({ 
                            turnosSeleccionados, 
                            alternarTurno, 
                            aplicarATodosLosDias, 
                            aplicarProgramacionMasiva, 
                            idEntidad,
                            idServ,
                            desServ,
                            idServicioActual
                        }) => {
console.log("turnosSeleccionados"+JSON.stringify(turnosSeleccionados))                            

    const cantidadSeleccionada = turnosSeleccionados.length;
    const estaListoParaAplicar = cantidadSeleccionada > 0;
    //  Carga de Turnos
    const listaDeTurnos = obtenerListaTurnos();
    const [idServicio, setIdServicio] = useState(""); 
    const [descripcionServicio, setDescripcionServicio] = useState(""); 
    
    return (
        <div className="card shadow-lg bg-white h-100 border-0">
            <div className="card-header bg-primary text-white fw-bold py-3">
                <Icono nombre="PlusCircle" className="me-2" style={{width: '20px', height: '20px'}} />
                Configurar Lote
            </div>
            <div className="card-body">
                 <h5 className="h6 fw-bold mb-3 text-dark">1. Selecciona Consultorio :</h5>
                <div className="d-grid gap-4 mb-4">
                    <Servicio    
                        idEntidad={idEntidad}
                        value={idServicio} 
                        valueServicio={(id) => { 
                            setIdServicio(id);
                            idServ(id);
                        }}
                        textServicio={(txt) => {
                            setDescripcionServicio(txt);
                            desServ(txt);
                        }}                                
                    />                    
                </div>
                 <h5 className="h6 fw-bold mb-3 text-dark">2. Selecciona Turnos:</h5>
                <div className="d-grid gap-2">
                    {listaDeTurnos.map(turno => {
                        const estaSeleccionado = turnosSeleccionados.includes(turno.idTurno);
                        return (
                            <button
                                key={turno.idTurno}
                                onClick={() => alternarTurno(turno.idTurno)}
                                className={`btn d-flex flex-column align-items-start fw-semibold text-start transition-all ${estaSeleccionado ? 'btn-success shadow-sm' : 'btn-outline-secondary'}`}
                            >
                                {turno.descripcion}
                                <span className="small opacity-75" style={{fontSize: '0.7rem'}}>{turno.hora}</span>
                            </button>
                        );
                    })}
                </div>


                <div className="d-grid gap-2 mt-4">
                    <h5 className="h6 fw-bold mb-3 text-dark">3. Seleccionar Días:</h5>
                    <button onClick={aplicarATodosLosDias} className="btn btn-outline-info btn-sm fw-bold">
                        <Icono nombre="CalendarCheck" className="me-2" style={{width: '16px', height: '16px'}} />
                        Todo el Mes
                    </button>
                    <p className='small text-secondary mt-2' style={{fontSize: '0.75rem'}}>*Luego haz clic en los días específicos en el calendario para marcarlos.</p>
                </div>
            </div>
            <div className="card-footer bg-light border-top-0 d-grid py-3">
                <button
                    onClick={aplicarProgramacionMasiva}
                    disabled={!estaListoParaAplicar}
                    className={`btn ${estaListoParaAplicar ? 'btn-success' : 'btn-secondary'} fw-bold d-flex justify-content-center align-items-center py-2 shadow-sm`}
                >
                    <Icono nombre="CheckCircle" className="me-2" style={{width: '20px', height: '20px'}} />
                    Aplicar ({cantidadSeleccionada})
                </button>
            </div>
        </div>
    );
};

export default ProgramadorMasivo;