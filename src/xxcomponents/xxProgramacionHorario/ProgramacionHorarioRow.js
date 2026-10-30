
import  {useState, useEffect } from 'react';
import React  from 'react';
import {  Col,Row} from 'react-bootstrap';
import { IoIosAddCircle } from "react-icons/io";
import { AiTwotoneDelete } from "react-icons/ai";
const ProgramacionHorarioRow = ({
  row,
  onEliminarRegistro,
  onModificarRegistro,
}) => {

  


  return (
    <>
         <div key={row.id} style={{border: '1px solid rgba(0, 0, 0, 0.05)'} } >
            <Row className="row" > 
                 <Col className="col-3" 
                      style={{ color: row.diaSemana === 'DO' ? 'red' : 'lightblack' }}>
                        <a style={{ fontSize: 35, fontFamily:"Arial Narrow" }} >{row.dia} </a>
                        <sup style={{ fontSize: 12, color:"gray" }} >{row.diaSemana} </sup>
                 </Col>
                 
                 <Col   className="col-7 "
                          style={{border: '1px solid rgba(0, 0, 0, 0.05)'} } >
                          <a style={{ background: row.descripcionTurno === '' ? '' : row.color }}>
                          {row.descripcionTurno} 
                          </a> 
                 </Col>
                 <Col className='col-1'>
                          <IoIosAddCircle 
                              onClick={() => onModificarRegistro(row.id)}
                              size={30}>
                          </IoIosAddCircle>  
                 </Col>  
                <Col className='col-1'>
                              <AiTwotoneDelete 
                                  onClick={()=> onEliminarRegistro(row.id)}
                                  size={28}
                                  style={{color:"#C70039"}}
                                ></AiTwotoneDelete>  
                      </Col>                    
            </Row> 


        </div>
    </>
  );
}
export default ProgramacionHorarioRow;
