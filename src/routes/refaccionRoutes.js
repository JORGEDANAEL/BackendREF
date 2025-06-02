const express = require('express');
const router = express.Router();
const refaccionController = require('../controllers/refaccionController');

// Rutas para refacciones
router.get('/refacciones', refaccionController.getRefacciones);
router.post('/refacciones', refaccionController.createRefaccion);
router.put('/refacciones/:id', refaccionController.updateRefaccion);
router.delete('/refacciones/:id', refaccionController.deleteRefaccion);

module.exports = router; 