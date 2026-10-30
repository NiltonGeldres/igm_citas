// src/components/DigitalSignature/FirmaPeruPanel.js
import React, { useState } from 'react';
import Styles from '../../Styles'; // Asegúrate de que la ruta a Styles sea correcta
import { Signature, Loader2, CheckCircle, XCircle, FileText } from 'lucide-react';

/**
 * Clase simulada FirmaPeru para interactuar con el Invoker.
 * En un entorno real, esta clase sería proporcionada por el SDK de Firma Perú.
 * Asume que el Invoker expone un endpoint HTTP local.
 */
class FirmaPeru {
  constructor(invokerUrl) {
    this.invokerUrl = invokerUrl;
    // Asegura que la URL termine en / para facilitar la construcción de rutas
    if (!this.invokerUrl.endsWith('/')) {
      this.invokerUrl += '/';
    }
    console.log(`FirmaPeru Invoker inicializado con URL: ${this.invokerUrl}`);
  }

  /**
   * Simula la ejecución de la firma con Firma Perú Invoker.
   * @param {Array<Object>} pdfs - Array de objetos { url: string, name: string } de los documentos a firmar.
   * En un escenario real, las URLs podrían ser a tu backend que sirve los PDFs.
   * @param {Object} firmaParam - Parámetros de la firma (posx, posy, reason).
   * @param {string} token - Token de autenticación/sesión proporcionado por SGD.
   * @returns {Promise<Object>} Objeto con url_base y status.
   */
  async ejecutar(pdfs, firmaParam, token) {
    console.log("Iniciando ejecución de Firma Perú Invoker...");
    console.log("Documentos:", pdfs);
    console.log("Parámetros de Firma:", firmaParam);
    console.log("Token:", token);

    // SIMULACIÓN DE LA LLAMADA AL INVOKER LOCAL
    // En un escenario real, esto sería una llamada fetch a un endpoint específico
    // que el FirmaPeru Invoker expone localmente (ej. via WebSocket o HTTP).
    // Los datos enviados serían los documentos, parámetros y token.
    // El Invoker abriría una ventana, pediría PIN, interactuaría con el DNIe/Token.

    try {
      // Simula una llamada a un endpoint local que el Invoker podría exponer.
      // La estructura exacta del payload y la respuesta dependerán de la API real de FirmaPeru Invoker.
      const response = await fetch(`${this.invokerUrl}signDocument`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Si el Invoker requiere autenticación
        },
        body: JSON.stringify({
          documents: pdfs.map(doc => ({ url: doc.url, name: doc.name })),
          signatureParameters: firmaParam
        }),
        // Si el Invoker está en localhost, puede que necesites 'no-cors' si no tiene CORS configurado,
        // pero esto impediría leer la respuesta. Idealmente, el Invoker tendría CORS bien configurado.
        // mode: 'cors',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al comunicarse con Firma Perú Invoker: ${response.status} - ${errorText}`);
      }

      const result = await response.json(); // Asumiendo que el Invoker devuelve JSON

      // La imagen muestra url_base como parte de la respuesta.
      // Aquí simulamos esa respuesta.
      if (result.status === 'OK' && result.url_base) {
        console.log("Firma Perú Invoker ejecutado con éxito.");
        return {
          status: 'OK',
          url_base: result.url_base, // URL base para los documentos firmados
          signedDocuments: pdfs.map(doc => ({ // Simulación de URLs de documentos firmados
            originalName: doc.name,
            signedUrl: `${result.url_base}${encodeURIComponent(doc.name)}_signed.pdf?token=${token}`
          }))
        };
      } else {
        throw new Error(`Firma Perú Invoker devolvió un error: ${result.message || JSON.stringify(result)}`);
      }

    } catch (error) {
      console.error("FirmaPeru.ejecutar falló:", error);
      throw new Error(`No se pudo conectar o firmar con Firma Perú Invoker: ${error.message}`);
    }
  }
}

/**
 * Componente de React para la integración con Firma Perú Invoker.
 * Muestra los documentos a firmar y el proceso de firma.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {Object} props.medicalRecordData - Los datos completos del registro médico a firmar.
 * @param {function(string): void} props.onModalMessage - Función para mostrar mensajes en el modal principal de la aplicación.
 */
function FirmaPeruPanel({ medicalRecordData, onModalMessage }) {
  const [isSigning, setIsSigning] = useState(false);
  const [signatureStatus, setSignatureStatus] = useState(null); // 'success', 'error', null
  const [signedDocumentUrls, setSignedDocumentUrls] = useState([]);

  // URLs de los documentos a firmar (ejemplo, en un caso real vendrían de tu backend)
  // Para la atención médica, podrías generar un PDF dinámicamente en tu backend
  // y luego proporcionar la URL para que FirmaPeru Invoker lo descargue y firme.
  const documentsToSign = [
    { url: "http://miservidor.com/docs/atencion_medica_1.pdf", name: "AtencionMedica_PacienteX.pdf" },
    // Si tu aplicación genera múltiples documentos para la firma
    // { url: "http://miservidor.com/docs/consentimiento_2.pdf", name: "Consentimiento_PacienteX.pdf" },
  ];

  // Parámetros de la firma gráfica (ejemplo)
  const firmaParameters = {
    posx: 10,
    posy: 12,
    reason: "Soy el autor del documento de atención médica",
  };

  // Token (simulado, en un caso real vendría de tu backend o SGD)
  const signatureToken = "TOKEN_ENVIADO_POR_SGD_O_BACKEND";

  // Instancia del Invoker (la IP y puerto deben coincidir con donde se ejecuta el Invoker localmente)
  // ¡IMPORTANTE! Reemplaza esta IP y puerto con la configuración real de tu Firma Perú Invoker.
  const firmaPeruInvoker = new FirmaPeru("http://192.168.1.10:9091"); // IP y puerto de la máquina local con el Invoker

  const handleSignDocuments = async () => {
    setIsSigning(true);
    setSignatureStatus(null);
    setSignedDocumentUrls([]);
    onModalMessage('Iniciando proceso de firma con Firma Perú Invoker...');

    // En un escenario real, aquí podrías primero enviar 'medicalRecordData' a tu backend
    // para que lo convierta en un PDF/XML y te devuelva una URL temporal para firmar.
    // Por simplicidad, usaremos las URLs de ejemplo 'documentsToSign'.

    try {
      const result = await firmaPeruInvoker.ejecutar(documentsToSign, firmaParameters, signatureToken);

      if (result.status === 'OK') {
        setSignatureStatus('success');
        setSignedDocumentUrls(result.signedDocuments);
        onModalMessage('¡Documentos firmados digitalmente con éxito por Firma Perú!');
      } else {
        throw new Error(`Firma fallida: ${result.message || 'Respuesta inesperada del Invoker.'}`);
      }
    } catch (error) {
      console.error('Error durante la firma con Firma Perú Invoker:', error);
      setSignatureStatus('error');
      onModalMessage(`Ocurrió un error al firmar: ${error.message}. Asegúrate que Firma Perú Invoker esté ejecutándose.`);
    } finally {
      setIsSigning(false);
    }
  };

  // Función auxiliar para renderizar el resumen de los datos (similar al DigitalSignaturePanel anterior)
  const renderMedicalRecordSummary = (data) => {
    if (!data || Object.keys(data).length === 0 || (!data.patient && !data.attentionDetails)) {
      return <p style={{ color: Styles.colorTextMedium, textAlign: 'center' }}>No hay datos de atención médica para firmar. Por favor, complete las secciones del registro médico.</p>;
    }

    return (
      <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
        <h4 style={{ ...Styles.sectionTitle, fontSize: '18px', marginBottom: '10px', color: Styles.colorTextDark }}>Resumen del Paciente:</h4>
        <p style={Styles.listItemText}><strong>Nombre:</strong> {data.patient?.name || 'N/A'}</p>
        <p style={Styles.listItemText}><strong>ID:</strong> {data.patient?.id || 'N/A'}</p>
        <p style={Styles.listItemText}><strong>Sexo:</strong> {data.patient?.sex || 'N/A'}</p>
        <p style={Styles.listItemText}><strong>Edad:</strong> {data.patient?.age || 'N/A'}</p>

        <h4 style={{ ...Styles.sectionTitle, fontSize: '18px', marginTop: '20px', marginBottom: '10px', color: Styles.colorTextDark }}>Detalles de la Atención:</h4>
        {Object.keys(data.attentionDetails || {}).length > 0 ? (
          Object.entries(data.attentionDetails).map(([key, value]) => (
            <div key={key} style={{ marginBottom: '10px', borderBottom: `1px solid ${Styles.colorBorderSubtle}`, paddingBottom: '5px' }}>
              <p style={{ ...Styles.listItemText, fontWeight: 'bold', marginBottom: '5px' }}>{key.replace(/Panel/g, '').replace(/([A-Z])/g, ' $1').trim()}:</p>
              {Array.isArray(value) ? (
                value.length > 0 ? (
                  value.map((item, index) => (
                    <p key={item.id || index} style={{ ...Styles.listItemText, marginLeft: '10px', fontSize: '14px' }}>
                      - {item.label || item.diagnostico || item.examen || item.descripcion || JSON.stringify(item)}
                      {item.codigoCIE && ` (CIE: ${item.codigoCIE})`}
                      {item.cantidad && ` (Cant: ${item.cantidad})`}
                      {item.dosis && ` (Dosis: ${item.dosis})`}
                    </p>
                  ))
                ) : (
                  <p style={{ ...Styles.listItemText, marginLeft: '10px', fontSize: '14px', color: Styles.colorTextMedium }}>Sin registros.</p>
                )
              ) : (
                <p style={{ ...Styles.listItemText, marginLeft: '10px', fontSize: '14px' }}>{value || 'N/A'}</p>
              )}
            </div>
          ))
        ) : (
          <p style={{ color: Styles.colorTextMedium, textAlign: 'center' }}>No hay detalles de atención registrados.</p>
        )}
      </div>
    );
  };

  return (
    <div style={Styles.medicalSection}>
      <h3 style={Styles.sectionTitle}>Firma Digital con Firma Perú</h3>

      {renderMedicalRecordSummary(medicalRecordData)}

      <button
        onClick={handleSignDocuments}
        style={{
          ...Styles.saveButton,
          backgroundColor: isSigning ? Styles.colorTextMedium : Styles.colorPrimary,
          marginTop: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}
        disabled={isSigning}
      >
        {isSigning ? (
          <>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
            Firmando Documentos...
          </>
        ) : (
          <>
            <Signature size={24} />
            Firmar Documentos con Firma Perú
          </>
        )}
      </button>

      {signatureStatus === 'success' && (
        <div style={{ marginTop: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: Styles.colorGreenSuccess, marginBottom: '10px' }}>
            <CheckCircle size={24} style={{ marginRight: '8px' }} />
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>¡Firma Exitosa!</p>
          </div>
          <h4 style={{ ...Styles.sectionTitle, fontSize: '16px', marginBottom: '10px', textAlign: 'center' }}>Documentos Firmados:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {signedDocumentUrls.map((doc, index) => (
              <a
                key={index}
                href={doc.signedUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...Styles.listItemButton, // Reutiliza estilo de botón de lista
                  backgroundColor: Styles.colorBackgroundLight,
                  color: Styles.colorPrimary,
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                }}
              >
                <FileText size={18} />
                {doc.originalName} (Ver Firmado)
              </a>
            ))}
          </div>
        </div>
      )}
      {signatureStatus === 'error' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px', color: Styles.colorAlert }}>
          <XCircle size={24} style={{ marginRight: '8px' }} />
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>Error en la Firma.</p>
        </div>
      )}

      {/* Animación de spin para el loader */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default FirmaPeruPanel;