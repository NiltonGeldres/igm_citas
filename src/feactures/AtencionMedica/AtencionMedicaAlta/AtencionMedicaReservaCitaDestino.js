import  { useState, useEffect,useCallback } from 'react';
import Swal from "sweetalert2";
import { X } from 'lucide-react';
import CalendarioReserva from './CalendarioReserva';
import ProgramacionHoras from './ProgramacionHoras';
import CitaService from '../../../feactures/Cita/CitaService'; // Ajustar ruta según tu proyecto
import CitaSeparadaService from '../../CitaSeparada/CitaSeparadaService';

import ProgramacionHorarioIndividualService from '../../../feactures/ProgramacionHorario/ProgramacionHorarioService';
//import { transformarProgramacion } from './mapper/CitaProgramacionMedicaUI';
import { transformarProgramacion } from '../../../apps/paciente-app/mapper/CitaProgramacionMedicaUI';



export const AtencionMedicaReservaCitaDestino = ({
  isOpen,
  onClose,
  idMedico,
  idEspecialidad,
  nombreMedico = '',
  nombreEspecialidad = '',
  onCitaGuardadaEnBackend // Callback que recibe el objeto final para insertar en PanelAlta
}) => {
  const hoy = new Date();

  const [datosReserva, setDatosReserva] = useState({
    doctor: { id: idMedico, nombre: nombreMedico },
    especialidad: { idEspecialidad: idEspecialidad, nombre: nombreEspecialidad },
    fechaObjeto: { mes: hoy.getMonth(), anio: hoy.getFullYear(), dia: null },
    fechaYYYYMMDD: '',
    hora: null,
    idProgramacion: null,
    idServicio: null
  });

  const [programacionMensual, setProgramacionMensual] = useState([]);
  const [cargandoProg, setCargandoProg] = useState(false);
  const [procesandoBloqueo, setProcesandoBloqueo] = useState(false);

  // Carga de la agenda mensual usando el servicio oficial
  const obtenerProgramacionMedicaMes = useCallback(async (mesNum, anioNum, espId, medId) => {
    if (!medId || !espId) return;

    setCargandoProg(true);
    try {
      const data = await ProgramacionHorarioIndividualService.obtenerProgramacionMesUsuario(
        mesNum, 
        anioNum, 
        espId, 
        medId, 
        0
      );
      
      const dataProgramacionUI = transformarProgramacion(
        data?.data?.programacionMedicaDiaResponse || []
      );
      setProgramacionMensual(dataProgramacionUI);
    } catch (error) {
      console.error("Error al obtener la programación:", error);
      setProgramacionMensual([]);
    } finally {
      setCargandoProg(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && idMedico && idEspecialidad) {
      const { mes, anio } = datosReserva.fechaObjeto;
      obtenerProgramacionMedicaMes(mes + 1, anio, idEspecialidad, idMedico);
    }
  }, [isOpen, idMedico, idEspecialidad, datosReserva.fechaObjeto.mes, datosReserva.fechaObjeto.anio, obtenerProgramacionMedicaMes]);

  if (!isOpen) return null;

  const handleCambiarMes = (direccion) => {
    const mesActual = datosReserva.fechaObjeto.mes;
    const anioActual = datosReserva.fechaObjeto.anio;
    
    const fechaTemp = new Date(anioActual, mesActual, 1);
    fechaTemp.setMonth(fechaTemp.getMonth() + direccion);
    
    const nuevoMesIndice = fechaTemp.getMonth();
    const nuevoAnio = fechaTemp.getFullYear();

    setDatosReserva(prev => ({
      ...prev,
      fechaObjeto: { ...prev.fechaObjeto, mes: nuevoMesIndice, anio: nuevoAnio, dia: null },
      fechaYYYYMMDD: '',
      hora: null
    }));

    obtenerProgramacionMedicaMes(nuevoMesIndice + 1, nuevoAnio, idEspecialidad, idMedico);
  };

  const handleSeleccionarDia = (dia) => {
    const { mes, anio } = datosReserva.fechaObjeto;
    const mesFormat = String(mes + 1).padStart(2, '0');
    const diaFormat = String(dia).padStart(2, '0');
    const fechaString = `${anio}${mesFormat}${diaFormat}`;

    setDatosReserva(prev => ({
      ...prev,
      fechaYYYYMMDD: fechaString,
      fechaObjeto: { ...prev.fechaObjeto, dia },
      hora: null
    }));
  };

  // --- LÓGICA DE BLOQUEO, CONFIRMACIÓN Y GUARDADO REAL EN EL BACKEND ---
  const handleHoraSeleccionada = async (hora, idProg, idServ) => {
    if (procesandoBloqueo) return;
    let timerInterval;
    setProcesandoBloqueo(true);

    try {
      // PASO 1: Bloqueo temporal en el Servidor
      const respBloqueo = await CitaService.getCitaBloquear(hora, datosReserva.fechaYYYYMMDD, datosReserva.doctor.id);
      const idBloqueo = respBloqueo.data.idCitaBloqueada;

      // PASO 2: Confirmación con el Usuario mediante SweetAlert2
      const result = await Swal.fire({
        title: '¿Confirmar próxima cita?',
        html: `Has seleccionado las <b>${hora}</b>.<br/>Confirma en <b>60</b> segundos.`,
        timer: 60000,
        timerProgressBar: true,
        showCancelButton: true,
        confirmButtonText: 'Sí, reservar',
        cancelButtonText: 'Cancelar',
        didOpen: () => {
          const b = Swal.getHtmlContainer().querySelector('b');
          timerInterval = setInterval(() => {
            if (b) b.textContent = Math.ceil(Swal.getTimerLeft() / 1000);
          }, 1000);
        },
        willClose: () => clearInterval(timerInterval)
      });

      // PASO 3: Acciones según respuesta del usuario
      if (result.isConfirmed) {
        // Ejecutar guardado real de la cita separada en el backend

        const res = await CitaSeparadaService.getCitaSeparadaCrear(
          datosReserva.fechaYYYYMMDD,
          hora,
          hora,
          0,
          datosReserva.doctor?.id,
          datosReserva.especialidad?.idEspecialidad,
          idServ,
          idProg,
          0,
          datosReserva.doctor?.monto || 0
        );

        if (res.data?.idCitaSeparada || res.data) {
          // Formatear fecha para lectura (YYYYMMDD -> DD/MM/YYYY)
          const yyyy = datosReserva.fechaYYYYMMDD.substring(0, 4);
          const mm = datosReserva.fechaYYYYMMDD.substring(4, 6);
          const dd = datosReserva.fechaYYYYMMDD.substring(6, 8);
          const fechaFormateada = `${dd}/${mm}/${yyyy}`;

          const descripcionConcatenada = `Próxima Cita reservada para el ${fechaFormateada} a las ${hora}${nombreEspecialidad ? ` (${nombreEspecialidad})` : ''} — Dr(a). ${nombreMedico}`;

          // Enviar el resultado al componente padre para que lo guarde en el PanelAlta con idAlta: 1
          onCitaGuardadaEnBackend({
            idAlta: 1,
            descripcionAlta: descripcionConcatenada
          });

          Swal.fire('¡Éxito!', 'La próxima cita ha sido registrada correctamente en el destino.', 'success');
          onClose();
        } else {
          Swal.fire("Atención", "No se pudo completar la reserva de la cita.", "warning");
        }
      }

      // Limpiar el bloqueo temporal
      await CitaService.getEliminarCitaBloqueada(idBloqueo);

    } catch (error) {
      console.error("Error al procesar la reserva:", error);
      Swal.fire('Error', 'El horario ya no está disponible o hubo un problema de conexión.', 'error');
    } finally {
      setProcesandoBloqueo(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.5)',
      backdropFilter: 'blur(3px)',
      zIndex: 1200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        maxWidth: '400px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ backgroundColor: '#006699', color: '#ffffff', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h6 style={{ margin: 0, fontWeight: '700', fontSize: '13px' }}>Reservar Próxima Cita</h6>
            <span style={{ fontSize: '10.5px', color: '#e0f2fe' }}>
              {nombreEspecialidad ? `${nombreEspecialidad}` : ''} {nombreMedico ? `— ${nombreMedico}` : ''}
            </span>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <CalendarioReserva
            fechaObjeto={datosReserva.fechaObjeto}
            cambiarMes={handleCambiarMes}
            programacionMensual={programacionMensual}
            seleccionarDia={handleSeleccionarDia}
            cargando={cargandoProg || procesandoBloqueo}
          />

          <ProgramacionHoras
            idMedico={datosReserva.doctor?.id}
            idEspecialidad={datosReserva.especialidad?.idEspecialidad}
            fechaCalendar={datosReserva.fechaYYYYMMDD}
            horaActualSeleccionada={datosReserva.hora}
            onHoraSeleccionada={handleHoraSeleccionada}
          />
        </div>

        <div style={{ padding: '8px 10px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', color: '#475569', padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};