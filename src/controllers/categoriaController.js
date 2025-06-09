const Categoria = require('../models/Categoria');

// Obtener todas las categorías
exports.getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find().sort({ nombre: 1 });
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las categorías', error: error.message });
  }
};

// Obtener una categoría por ID
exports.getCategoriaById = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la categoría', error: error.message });
  }
};

// Crear una nueva categoría
exports.createCategoria = async (req, res) => {
  try {
    const nuevaCategoria = new Categoria(req.body);
    const categoriaGuardada = await nuevaCategoria.save();
    res.status(201).json(categoriaGuardada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear la categoría', error: error.message });
  }
};

// Actualizar una categoría
exports.updateCategoria = async (req, res) => {
  try {
    const categoriaActualizada = await Categoria.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!categoriaActualizada) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    res.json(categoriaActualizada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar la categoría', error: error.message });
  }
};

// Eliminar una categoría
exports.deleteCategoria = async (req, res) => {
  try {
    const categoriaEliminada = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoriaEliminada) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    res.json({ mensaje: 'Categoría eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la categoría', error: error.message });
  }
}; 