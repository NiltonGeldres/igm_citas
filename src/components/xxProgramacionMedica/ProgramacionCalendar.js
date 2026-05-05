
import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../Login/services/auth.service";
import ProgramacionMedicaService from "./ProgramacionMedicaService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Col } from "react-bootstrap";

const ProgramacionCalendar = ({idMedico,idEspecialidad,handleChangeCalendar}) => {
    const [loading, setLoading]  = useState(false);
    const navigate = useNavigate();
    const [diaProgramado, setDiaProgramado] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [fechaCitas, setFechaCitas] = useState('');

    useEffect(() => {
        const LoadData = ()=>{
            if (idMedico !=''  &&  idEspecialidad!='') {                
                setLoading(true);
                ProgramacionMedicaService.getDias(idMedico,idEspecialidad)
                .then((response) => {
                    console.log(JSON.stringify(response.data.programacionMedica))
                        if (response.data.programacionMedica) {
                            let dias= [];
                            response.data.programacionMedica.map(post => {
                                dias.push(new Date(post.fechaDate))
                            })
                            setDiaProgramado(dias);
                            setFechaCitas('')
                        } else { 
                            setDiaProgramado([]) ;
                            setFechaCitas('')
                        }
                        setLoading(false);
                },(error) => {
                    setDiaProgramado([])
                    setFechaCitas('')
                    if (error.response && error.response.status === 403) {
                        AuthService.logout();
                        navigate("/login");
                        window.location.reload();
                    } 
                });
             } else { 
                setDiaProgramado([]);
                setFechaCitas('')
            }
        };
        LoadData() ;
    }, [idMedico,idEspecialidad]);

    if (loading) {
        return <h4>Loading Programacion...</h4>;
    }    
  return (
    
        <>
            <Col>
                <h6>Seleccionar la Fecha</h6>                    
                    <DatePicker 
                            inline
                            includeDates={diaProgramado}
                            dateFormat="dd/MM/yyyy"
                            selected={startDate} 
                            onChange={handleChangeCalendar}
                         />
            </Col>                         
         </>
    )
}
export default ProgramacionCalendar;



