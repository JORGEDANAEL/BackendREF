const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');

// Rutas para proveedores
router.get('/proveedores', proveedorController.getProveedores);
router.post('/proveedores', proveedorController.createProveedor);
router.put('/proveedores/:id', proveedorController.updateProveedor);
router.delete('/proveedores/:id', proveedorController.deleteProveedor);

module.exports = router; 