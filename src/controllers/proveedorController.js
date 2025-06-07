const Proveedor = require('../models/Proveedor');

// Obtener todos los proveedores con paginación y búsqueda
exports.getProveedores = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const query = search
      ? {
          $or: [
            { nombre: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { productos: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const total = await Proveedor.countDocuments(query);
    const proveedores = await Proveedor.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ nombre: 1 });

    res.json({
      proveedores,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProveedores: total
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los proveedores', error: error.message });
  }
};

// Obtener un proveedor por ID
exports.getProveedorById = async (req, res) => {
  try {
    const proveedor = await Proveedor.findById(req.params.id);
    if (!proveedor) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }
    res.json(proveedor);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el proveedor', error: error.message });
  }
};

// Crear un nuevo proveedor
exports.createProveedor = async (req, res) => {
  try {
    const nuevoProveedor = new Proveedor(req.body);
    const proveedorGuardado = await nuevoProveedor.save();
    res.status(201).json(proveedorGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear el proveedor', error: error.message });
  }
};

// Actualizar un proveedor
exports.updateProveedor = async (req, res) => {
  try {
    const proveedorActualizado = await Proveedor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!proveedorActualizado) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }
    res.json(proveedorActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar el proveedor', error: error.message });
  }
};

// Eliminar un proveedor
exports.deleteProveedor = async (req, res) => {
  try {
    const proveedorEliminado = await Proveedor.findByIdAndDelete(req.params.id);
    if (!proveedorEliminado) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }
    res.json({ mensaje: 'Proveedor eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el proveedor', error: error.message });
  }
}; 