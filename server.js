const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Servir la interfaz web de pruebas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint para simular la descarga del borrador
app.get('/obtener-pdf-local', (req, res) => {
    try {
        const rutaPdf = path.join(__dirname, 'documento_borrador.pdf');
        if (!fs.existsSync(rutaPdf)) {
            return res.status(404).json({ status: "ERROR", message: "No se encontró el archivo documento_borrador.pdf." });
        }
        const pdfBase64 = fs.readFileSync(rutaPdf).toString('base64');
        res.json({ status: "OK", base64: pdfBase64 });
    } catch (error) {
        res.status(500).json({ status: "ERROR", message: error.message });
    }
});

// ============================================================================
// ENDPOINT CRIPTOGRÁFICO: CONEXIÓN CON EL INVOKER LOCAL DE FIRMA PERÚ
// ============================================================================
app.post('/firmar-lote', async (req, res) => {
    const { documents } = req.body;
    console.log(`\n📡 [Invoker FirmaPerú] Iniciando flujo local para ${documents.length} documentos.`);

    const documentsSigned = [];

    // Definimos la ruta donde se encuentra instalado el firmador oficial de tu captura
    // Nota: Si el instalador crea un ejecutable en Archivos de Programa tipo "FirmaPeru.exe", apunta a ese.
    const rutaFirmaPeruExe = `"C:\\PERU\\DNIe\\idp\\setupx64.exe"`; 

    for (const doc of documents) {
        console.log(`🔒 Invocando interfaz de Firma Perú para el documento: ${doc.id}`);

        const rutaTemporalBorrador = path.join(__dirname, `${doc.id}_borrador.pdf`);
        const rutaTemporalFirmado = path.join(__dirname, `${doc.id}_firmado.pdf`);

        // Escribimos los bytes recibidos del navegador temporalmente en el disco
        fs.writeFileSync(rutaTemporalBorrador, Buffer.from(doc.param_file, 'base64'));

        try {
            // Ejecutamos el software oficial de Firma Perú pasándole los archivos como parámetros de entrada y salida
            await new Promise((resolve, reject) => {
                // Nota: Los argumentos varían según la compilación de la PCM. Generalmente aceptan rutas de entrada y salida directas.
                const comando = `${rutaFirmaPeruExe} "${rutaTemporalBorrador}" "${rutaTemporalFirmado}"`;
                
                exec(comando, (error, stdout, stderr) => {
                    if (error) {
                        reject(new Error(`Error al levantar Firma Perú: ${error.message}`));
                    } else {
                        resolve(stdout);
                    }
                });
            });

            // Esperar un breve instante para garantizar la escritura del archivo por la app externa
            let intentos = 0;
            while (!fs.existsSync(rutaTemporalFirmado) && intentos < 30) {
                await new Promise(r => setTimeout(r, 1000));
                intentos++;
            }

            if (!fs.existsSync(rutaTemporalFirmado)) {
                throw new Error("El proceso fue cancelado o Firma Perú no generó el archivo firmado.");
            }

            // Leemos el archivo PDF procesado por el software oficial
            const pdfFirmadoBytes = fs.readFileSync(rutaTemporalFirmado);
            const base64Firmado = Buffer.from(pdfFirmadoBytes).toString('base64');

            documentsSigned.push({
                id: doc.id,
                file_signed: base64Firmado
            });

            // Limpieza de archivos temporales locales
            if (fs.existsSync(rutaTemporalBorrador)) fs.unlinkSync(rutaTemporalBorrador);
            if (fs.existsSync(rutaTemporalFirmado)) fs.unlinkSync(rutaTemporalFirmado);

        } catch (err) {
            console.error(`❌ Error en el proceso de Firma Perú para ${doc.id}:`, err.message);
            if (fs.existsSync(rutaTemporalBorrador)) fs.unlinkSync(rutaTemporalBorrador);
            return res.status(500).json({ status: "ERROR", message: err.message });
        }
    }

    res.json({
        status: "OK",
        message: "Firma completada de forma nativa a través de Firma Perú.",
        documents_signed: documentsSigned
    });
});

const PORT = 9091;
app.listen(PORT, () => {
    console.log(`\n🚀 Servidor de Producción Local encendido en el puerto ${PORT}`);
    console.log(`🔌 Conecta tu lector USB, introduce tu DNIe y actualiza http://localhost:${PORT}`);
});
