const Refaccion = require('../models/Refaccion');

const refaccionController = {
    // Obtener todas las refacciones con paginación
    async getRefacciones(req, res) {
        try {
            const { search = '', page = 1, limit = 10 } = req.query;
            const skip = (page - 1) * limit;
            
            const query = search ? {
                $or: [
                    { nombre: { $regex: search, $options: 'i' } },
                    { categoria: { $regex: search, $options: 'i' } }
                ]
            } : {};

            const [refacciones, total] = await Promise.all([
                Refaccion.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(parseInt(limit)),
                Refaccion.countDocuments(query)
            ]);

            res.status(200).json({
                refacciones,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                totalItems: total
            });
        } catch (error) {
            console.error("Error al obtener refacciones:", error);
            res.status(500).json({ message: "Error al obtener las refacciones" });
        }
    },

    // Crear una nueva refacción
    async createRefaccion(req, res) {
        try {
            const { nombre, descripcion, precio, stock, categoria } = req.body;
            
            const nuevaRefaccion = new Refaccion({
                nombre,
                descripcion,
                precio,
                stock,
                categoria
            });

            await nuevaRefaccion.save();
            res.status(201).json(nuevaRefaccion);
        } catch (error) {
            console.error("Error al crear refacción:", error);
            res.status(500).json({ message: "Error al crear la refacción" });
        }
    },

    // Actualizar una refacción
    async updateRefaccion(req, res) {
        try {
            const { id } = req.params;
            const { nombre, descripcion, precio, stock, categoria } = req.body;

            const refaccionActualizada = await Refaccion.findByIdAndUpdate(
                id,
                { nombre, descripcion, precio, stock, categoria },
                { new: true }
            );

            if (!refaccionActualizada) {
                return res.status(404).json({ message: "Refacción no encontrada" });
            }

            res.status(200).json(refaccionActualizada);
        } catch (error) {
            console.error("Error al actualizar refacción:", error);
            res.status(500).json({ message: "Error al actualizar la refacción" });
        }
    },

    // Eliminar una refacción
    async deleteRefaccion(req, res) {
        try {
            const { id } = req.params;
            const refaccionEliminada = await Refaccion.findByIdAndDelete(id);

            if (!refaccionEliminada) {
                return res.status(404).json({ message: "Refacción no encontrada" });
            }

            res.status(200).json({ message: "Refacción eliminada exitosamente" });
        } catch (error) {
            console.error("Error al eliminar refacción:", error);
            res.status(500).json({ message: "Error al eliminar la refacción" });
        }
    }
};

module.exports = refaccionController; 