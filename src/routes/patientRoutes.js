const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
// Importamos el middleware corregido con su nuevo nombre
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/patients
// @desc    Registrar un nuevo paciente (RUTA PROTEGIDA)
// @access  Private (se requiere token)
router.post('/', authMiddleware, patientController.registerPatient);

module.exports = router;