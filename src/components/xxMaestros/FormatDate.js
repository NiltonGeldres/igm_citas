/** convertir fecha tipo date  a texto año/mes/dia */
const format_yyyymmdd = (d) => {
    if(d.getFullYear()<1900 || d.getFullYear()>9999){
       d= new Date();     
    }     
    let dia = ( d.getDate() < 10) ? '0' + d.getDate() : d.getDate() ;
    let mes =( (d.getMonth()+1) < 10) ? '0' + (d.getMonth()+1) : (d.getMonth()+1);
    let anio = (   d.getFullYear() < 10) ? '000' + d.getFullYear() 
                : (
                    (d.getFullYear() < 100 && d.getFullYear() >= 10) ? '00' + d.getFullYear()
                       : (( d.getFullYear() < 1000 && d.getFullYear() >= 100) ? '0' + d.getFullYear()
                            : d.getFullYear()
                       )  
                  );
                    
    let fecha = anio.toString()+mes.toString()+dia.toString();
    return fecha
};

/** convertir  fecha atexto dias mes año */
const format_ddmmyyyy = (d) => {
    console.log(" fechas en formato"+d);
    let mes =( (d.getMonth()+1) < 10) ? '0' + (d.getMonth()+1) : (d.getMonth()+1);
    let dia = ( d.getDate() < 10) ? '0' + d.getDate() : d.getDate() ;
    let anio = (d.getFullYear().toString());
    let fecha = dia.toString()+mes.toString()+anio.toString();
  return fecha
};

/** convertir fecha a texgto con "/"  */
const format_dd_mm_yyyy = (d) => {
    console.log(" fechas en formato"+d);
    let mes =( (d.getMonth()+1) < 10) ? '0' + (d.getMonth()+1) : (d.getMonth()+1);
    let dia = ( d.getDate() < 10) ? '0' + d.getDate() : d.getDate() ;
    let anio = (d.getFullYear().toString());
    let fecha = dia.toString()+'/'+mes.toString()+'/'+anio.toString();
  return fecha
};

/** convertir texto a fecha */
const format_fecha = (d) => {
    let fecha;
    if(d!=='' && d!=='null' && d!=='undefined' && d!==null ){
        let dia =  d.substring(6,8) ;
        let mes =  d.substring(4,6);
        let anio = d.substring(0,4);
    //    let fecha = dia.toString()+mes.toString()+anio.toString();
        fecha = dia.toString()+"/"+mes.toString()+"/"+anio.toString();
    }
    return fecha
};

const FormatDate = {
    format_fecha,
    format_ddmmyyyy,
    format_yyyymmdd,
    format_dd_mm_yyyy,
};

export default FormatDate;