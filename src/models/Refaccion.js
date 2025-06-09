const mongoose = require('mongoose');

const refaccionSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    descripcion: { 
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true
    },
    precio: { 
        type: Number, 
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser negativo']
    },
    stock: { 
        type: Number, 
        required: [true, 'El stock es obligatorio'],
        min: [0, 'El stock no puede ser negativo']
    },
    categoria: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: [true, 'La categoría es obligatoria']
    },
    proveedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proveedor',
        required: [true, 'El proveedor es obligatorio']
    }
}, { timestamps: true });

const Refaccion = mongoose.models.Refaccion || mongoose.model('Refaccion', refaccionSchema);

module.exports = Refaccion; 