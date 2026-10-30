// src/components/AtencionMedica/AtencionMedicaPacienteDatos/AtencionMedicaPacienteCitadoSeleccionar.js
import React, { useState, useEffect } from 'react';
import Styles from '../../../Styles'; // Asegúrate de que la ruta a Styles sea correcta

/**
 * Modal para seleccionar un paciente de una lista de citados.
 * Incluye un campo de búsqueda para filtrar la lista.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {boolean} props.isOpen - Si el modal está abierto o no.
 * @param {function(): void} props.onClose - Función para cerrar el modal.
 * @param {function(Object): void} props.onSelectPatient - Función para manejar la selección de un paciente.
 */
function AtencionMedicaPacienteCitadoSeleccionar({ isOpen, onClose, onSelectPatient }) {
  // Estado para el término de búsqueda dentro del modal
  const [searchTerm, setSearchTerm] = useState('');
  // Estado para la lista de pacientes citados (datos de ejemplo)
  const [citas, setCitas] = useState([]);
  // Estado para el mensaje del modal (usando el mismo estilo de MessageModal)
  const [modalMessage, setModalMessage] = useState('');

  // Función para generar un color aleatorio basado en el ID del paciente
  // Ahora usará un color azul fijo para el avatar
  const getBlueColorForPatient = (patientId) => {
    // Puedes usar un tono de azul fijo o generar variaciones de azul si lo deseas.
    // Para combinar con la cabecera, usaremos el azul principal de Styles.pageHeader.backgroundColor
    return '#007bff'; // Azul de la cabecera
  };

  // Simula la carga de citas al abrir el modal
  useEffect(() => {
    if (isOpen) {
      // Simulación de una llamada a una API para obtener citas
      const mockCitas = [
        { id: 'P001', nombre: 'Juan Pérez', sexo: 'Masculino', edad: 30, horaCita: '09:00 AM' },
        { id: 'P002', nombre: 'María García', sexo: 'Femenino', edad: 25, horaCita: '09:30 AM' },
        { id: 'P003', nombre: 'Carlos Ruiz', sexo: 'Masculino', edad: 50, horaCita: '10:00 AM' },
        { id: 'P004', nombre: 'Ana López', sexo: 'Femenino', edad: 40, horaCita: '10:30 AM' },
        { id: 'P005', nombre: 'Pedro Gómez', sexo: 'Masculino', edad: 65, horaCita: '11:00 AM' },
        { id: 'P006', nombre: 'Laura Fernández', sexo: 'Femenino', edad: 33, horaCita: '11:30 AM' },
        { id: 'P007', nombre: 'Sofía Martínez', sexo: 'Femenino', edad: 28, horaCita: '12:00 PM' },
        { id: 'P008', nombre: 'Diego Sánchez', sexo: 'Masculino', edad: 42, horaCita: '12:30 PM' },
      ];
      // Ordenar por hora de cita
      const sortedCitas = mockCitas.sort((a, b) => a.horaCita.localeCompare(b.horaCita));
      setCitas(sortedCitas);
      setSearchTerm(''); // Limpiar la búsqueda al abrir
      setModalMessage(''); // Limpiar mensajes
    }
  }, [isOpen]);

  // Filtra las citas basándose en el término de búsqueda
  const filteredCitas = citas.filter(cita =>
    cita.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cita.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Muestra un mensaje temporal en el modal.
   * @param {string} message - El mensaje a mostrar.
   */
  const showInternalModalMessage = (message) => {
    setModalMessage(message);
    setTimeout(() => setModalMessage(''), 3000); // Ocultar después de 3 segundos
  };

  if (!isOpen) return null;

  return (
    <div style={Styles.modalOverlay}>
      <div style={{ ...Styles.modalContent, maxWidth: '600px', width: '95%', padding: '20px' }}>
        <h3 style={{ ...Styles.modalTitle, marginBottom: '15px', fontSize: '22px' }}>Seleccionar Paciente Citado</h3>

        {/* Campo de búsqueda */}
        <input
          type="text"
          placeholder="Buscar por nombre o ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ ...Styles.autocompleteInput, marginBottom: '15px' }}
        />

        {/* Mensaje interno del modal */}
        {modalMessage && (
          <p style={{ ...Styles.modalMessage, color: Styles.errorText.color, marginBottom: '15px' }}>
            {modalMessage}
          </p>
        )}

        {/* Lista de pacientes filtrados */}
        {filteredCitas.length > 0 ? (
          <ul style={{
            listStyle: 'none',
            padding: '0',
            margin: '0',
            maxHeight: '300px',
            overflowY: 'auto',
            border: '1px solid #eee',
            borderRadius: '8px',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px' // Espacio entre los elementos de la lista
          }}>
            {filteredCitas.map(paciente => (
              <li
                key={paciente.id}
                style={Styles.patientWhatsAppListItem} // Usamos el nuevo estilo de burbuja de WhatsApp
                onClick={() => {
                  onSelectPatient(paciente);
                  onClose(); // Cierra el modal al seleccionar
                }}
              >
                {/* Avatar con la inicial del nombre */}
                <div style={{
                  ...Styles.patientWhatsAppAvatar,
                  backgroundColor: getBlueColorForPatient(paciente.id), // Color azul
                }}>
                  {paciente.nombre.charAt(0).toUpperCase()}
                </div>

                {/* Contenido principal del paciente */}
                <div style={Styles.patientWhatsAppContent}>
                  <div style={Styles.patientWhatsAppTopRow}>
                    <span style={Styles.patientWhatsAppName}>{paciente.nombre}</span>
                    <span style={Styles.patientWhatsAppTime}>{paciente.horaCita}</span>
                  </div>
                  <p style={Styles.patientWhatsAppDetails}>
                    ID: {paciente.id} &bull; {paciente.sexo} &bull; {paciente.edad} años
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
            No se encontraron pacientes citados o no hay citas disponibles.
          </p>
        )}

        <div style={{ ...Styles.itemEditModalActions, justifyContent: 'center', marginTop: '20px' }}>
          <button style={Styles.itemEditModalButtonCancel} onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default AtencionMedicaPacienteCitadoSeleccionar;
