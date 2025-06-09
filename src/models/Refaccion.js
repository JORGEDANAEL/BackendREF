const mongoose = require('mongoose');

const refaccionSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    descripcion: { 
        type: String,
        default: ''
    },
    precio: { 
        type: Number, 
        required: true,
        min: 0
    },
    stock: { 
        type: Number, 
        required: true,
        min: 0
    },
    categoria: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

const Refaccion = mongoose.models.Refaccion || mongoose.model('Refaccion', refaccionSchema);

module.exports = Refaccion; 