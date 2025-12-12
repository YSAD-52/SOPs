// api/SOP.js

const mongoose = require('mongoose');

// Definición del esquema (qué campos tendrá cada SOP)
const SOP_Schema = new mongoose.Schema({
    sop_title: {
        type: String,
        required: true,
        trim: true
    },
    sop_description: {
        type: String,
        required: true
    },
    sop_keywords: {
        type: String,
        required: true
    },
    // Array para almacenar las URLs de las imágenes generadas del PDF
    image_urls: [{
        type: String
    }],
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.models.SOP || mongoose.model('SOP', SOP_Schema);