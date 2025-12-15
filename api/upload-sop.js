// api/upload-sop.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // <--- ¡IMPORTACIÓN CRÍTICA!
const SOP = require('./SOP'); // Importar el modelo SOP

// --- 1. CONFIGURACIÓN INICIAL Y MIDDLEWARE ---

const app = express();
app.use(cors());

// CRÍTICO: Configurar límites altos de carga para Express/BodyParser (10MB)
// Esto permite que el body del request, que incluye el PDF, sea procesado.
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));


// Obtener la URL de conexión de MongoDB desde las variables de entorno de Vercel
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sops_db'; 

// --- 2. CONFIGURACIÓN DE ALMACENAMIENTO (MULTER) ---

const upload = multer({ 
    storage: multer.memoryStorage(), 
    // CRÍTICO: Aumentar el límite del archivo individual a 10MB
    limits: { fileSize: 10 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            // Muestra un error más claro si el archivo no es PDF
            cb(new Error('Solo se permiten archivos PDF (.pdf)!'), false);
        }
    }
}).single('sopFile'); // El nombre debe coincidir con el 'name' del input file en upload.html


// --- 3. CONEXIÓN A LA BASE DE DATOS ---

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('=> Usando conexión existente a DB.');
        return;
    }
    try {
        await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.log('=> Conexión exitosa a MongoDB!');
    } catch (error) {
        // IMPORTANTE: Si la variable MONGODB_URI está mal configurada en Vercel, el error aparecerá aquí
        console.error('=> Error al conectar a MongoDB. Asegúrate de que MONGODB_URI esté configurada en Vercel:', error);
    }
};


// --- 4. RUTA PRINCIPAL DE SUBIDA (POST) ---

app.post('/api/upload-sop', async (req, res) => {
    
    await connectDB();
    
    upload(req, res, async (err) => {
        
        if (err) {
            // Este error puede ser por el límite de tamaño de Multer o tipo de archivo
            console.error("Error de Multer:", err.message);
            return res.status(400).json({ success: false, message: "Error al subir el archivo: " + err.message });
        }
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No se encontró el archivo PDF." });
        }
        
        // Desestructurar los campos de texto del formulario
        const { sopTitle, sopDescription, sopKeywords } = req.body;
        
        // Log de prueba para verificar que los campos de texto llegaron
        console.log(`Datos recibidos: Titulo='${sopTitle}', Descripción='${sopDescription}'`);

        try {
            
            // --- 5. LÓGICA DE ALMACENAMIENTO (SIMULACIÓN) ---

            const sopId = `SOP-${Date.now()}`;
            const simulatedUrls = [
                `https://almacenamiento.com/${sopId}_page_1.png`,
                `https://almacenamiento.com/${sopId}_page_2.png`
            ];

            // 6. Guardar Metadatos en la Base de Datos
            const newSOP = new SOP({
                sop_title: sopTitle,
                sop_description: sopDescription,
                sop_keywords: sopKeywords,
                image_urls: simulatedUrls
            });

            const savedSOP = await newSOP.save();

            // Respuesta de éxito al frontend
            res.status(200).json({
                success: true,
                message: "SOP procesado y publicado con éxito.",
                sop_id: savedSOP._id,
                title: savedSOP.sop_title,
                images: savedSOP.image_urls
            });

        } catch (error) {
            console.error("Error durante el guardado en DB:", error);
            res.status(500).json({
                success: false,
                message: "Error interno del servidor durante el procesamiento y guardado: " + error.message
            });
        }
    });
});

// Exportar la aplicación para Vercel
module.exports = app;