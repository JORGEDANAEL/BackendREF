const mongoose = require('mongoose');

const proveedorSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    direccion: {
        type: String,
        required: true,
        trim: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    productos: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

const Proveedor = mongoose.models.Proveedor || mongoose.model('Proveedor', proveedorSchema);

module.exports = Proveedor; 