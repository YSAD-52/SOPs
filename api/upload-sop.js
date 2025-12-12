// api/upload-sop.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const SOP = require('./SOP'); // Importar el modelo SOP

// --- 1. CONFIGURACIÓN INICIAL Y MIDDLEWARE ---

const app = express();
app.use(cors());
app.use(express.json());

// Obtener la URL de conexión de MongoDB desde las variables de entorno de Vercel
// DEBES CONFIGURAR ESTO EN VERCEL (SETTINGS -> Environment Variables)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sops_db'; 

// --- 2. CONFIGURACIÓN DE ALMACENAMIENTO (MULTER) ---

// Usamos el almacenamiento en memoria para Multer, que es más seguro en Vercel
// y nos permite pasar el archivo directamente al servicio de almacenamiento.
const upload = multer({ 
    storage: multer.memoryStorage(), 
    limits: { fileSize: 5 * 1024 * 1024 }, // Limitar a 5MB (ajustar según necesidad)
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos PDF!'), false);
        }
    }
}).single('sopFile'); 


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
        console.error('=> Error al conectar a MongoDB:', error);
    }
};


// --- 4. RUTA PRINCIPAL DE SUBIDA (POST) ---

app.post('/api/upload-sop', async (req, res) => {
    
    // Conectar a la base de datos antes de procesar
    await connectDB();
    
    // Ejecutar Multer para procesar la subida
    upload(req, res, async (err) => {
        
        if (err) {
            return res.status(400).json({ success: false, message: "Error al subir el archivo: " + err.message });
        }
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No se encontró el archivo PDF." });
        }
        
        const { sopTitle, sopDescription, sopKeywords } = req.body;
        
        // El archivo PDF está en req.file.buffer (almacenamiento en memoria)
        // const pdfBuffer = req.file.buffer;
        
        // --- 5. LÓGICA DE CONVERSIÓN Y ALMACENAMIENTO (SIMULACIÓN) ---

        try {
            
            // 🛑 NOTA IMPORTANTE: LA CONVERSIÓN PDF -> IMAGEN SE SIMULA AQUÍ.
            // En un proyecto real, se enviaría 'pdfBuffer' a un servicio externo (como Cloudinary o AWS Lambda)
            // para la conversión a imágenes.
            
            // SIMULACIÓN: Creación de URLs de imágenes
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
            console.error("Error durante el procesamiento del SOP:", error);
            res.status(500).json({
                success: false,
                message: "Error interno del servidor durante el procesamiento y guardado."
            });
        }
    });
});

// Vercel requiere exportar el handler como una función
module.exports = app;