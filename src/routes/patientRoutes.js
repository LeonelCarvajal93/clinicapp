// Archivo: backend/src/routes/patientRoutes.js

const express = require('express');
const router = express.Router();

// Importamos el controlador con la lógica
const patientController = require('../controllers/patientController');

// Importamos los middlewares de seguridad
const auth = require('../middleware/authMiddleware');
const { permit } = require('../middleware/roleMiddleware');

// La lista de roles permitidos para las acciones:
const ROLES_ADMIN_DOCTOR = ['ADMIN', 'DOCTOR'];
const ROLES_ADMIN_DOCTOR_NURSE = ['ADMIN', 'DOCTOR', 'NURSE'];

// ---------------------------------------------------------------------
// @route   POST /api/patients
// @desc    Crear un nuevo registro de paciente.
// @access  Privado (ADMIN, DOCTOR)
// ---------------------------------------------------------------------
router.post(
    '/', 
    auth, // 1. Verifica el token JWT
    permit(ROLES_ADMIN_DOCTOR), // 2. Verifica si el rol tiene permiso de escritura
    patientController.createPatient
);

// ---------------------------------------------------------------------
// @route   GET /api/patients
// @desc    Obtener listado de todos los pacientes (o buscar por query)
// @access  Privado (ADMIN, DOCTOR, NURSE)
// ---------------------------------------------------------------------
router.get(
    '/', 
    auth, // 1. Verifica el token JWT
    permit(ROLES_ADMIN_DOCTOR_NURSE), // 2. Permite leer a más roles
    patientController.getPatients
);


// NOTA: Aquí se añadirían rutas para GET /:id, PUT /:id, y DELETE /:id
// Pero por ahora, estas dos son suficientes para iniciar el módulo.
module.exports = router;