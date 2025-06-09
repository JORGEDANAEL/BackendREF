const Refaccion = require('../models/Refaccion');

const refaccionController = {
    // Obtener todas las refacciones con paginación
    async getRefacciones(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';

            const query = search
                ? {
                    $or: [
                        { nombre: { $regex: search, $options: 'i' } },
                        { descripcion: { $regex: search, $options: 'i' } }
                    ]
                }
                : {};

            const total = await Refaccion.countDocuments(query);
            const refacciones = await Refaccion.find(query)
                .populate('categoria', 'nombre')
                .populate('proveedor', 'nombre')
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ nombre: 1 });

            res.json({
                refacciones,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalRefacciones: total
            });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener las refacciones', error: error.message });
        }
    },

    // Obtener una refacción por ID
    async getRefaccionById(req, res) {
        try {
            const refaccion = await Refaccion.findById(req.params.id)
                .populate('categoria', 'nombre')
                .populate('proveedor', 'nombre');
            if (!refaccion) {
                return res.status(404).json({ mensaje: 'Refacción no encontrada' });
            }
            res.json(refaccion);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener la refacción', error: error.message });
        }
    },

    // Crear una nueva refacción
    async createRefaccion(req, res) {
        try {
            const nuevaRefaccion = new Refaccion(req.body);
            const refaccionGuardada = await nuevaRefaccion.save();
            const refaccionConDetalles = await Refaccion.findById(refaccionGuardada._id)
                .populate('categoria', 'nombre')
                .populate('proveedor', 'nombre');
            res.status(201).json(refaccionConDetalles);
        } catch (error) {
            res.status(400).json({ mensaje: 'Error al crear la refacción', error: error.message });
        }
    },

    // Actualizar una refacción
    async updateRefaccion(req, res) {
        try {
            const refaccionActualizada = await Refaccion.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            ).populate('categoria', 'nombre')
             .populate('proveedor', 'nombre');

            if (!refaccionActualizada) {
                return res.status(404).json({ mensaje: 'Refacción no encontrada' });
            }
            res.json(refaccionActualizada);
        } catch (error) {
            res.status(400).json({ mensaje: 'Error al actualizar la refacción', error: error.message });
        }
    },

    // Eliminar una refacción
    async deleteRefaccion(req, res) {
        try {
            const refaccionEliminada = await Refaccion.findByIdAndDelete(req.params.id);
            if (!refaccionEliminada) {
                return res.status(404).json({ mensaje: 'Refacción no encontrada' });
            }
            res.json({ mensaje: 'Refacción eliminada exitosamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al eliminar la refacción', error: error.message });
        }
    }
};

module.exports = refaccionController; 