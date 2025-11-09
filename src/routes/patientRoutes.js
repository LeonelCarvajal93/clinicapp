const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
// ESTA LÍNEA DE IMPORTACIÓN ARREGLA EL "TypeError"
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware'); 

// RUTA PARA CREAR PACIENTE (Permisos Corregidos)
router.post(
    '/', 
    authMiddleware, 
    roleMiddleware(['ADMIN', 'NURSE', 'DOCTOR']), 
    patientController.createPatient
);

// RUTA PARA OBTENER TODOS LOS PACIENTES
router.get(
    '/', 
    authMiddleware, 
    roleMiddleware(['ADMIN', 'NURSE', 'DOCTOR']), 
    patientController.getAllPatients
);

// RUTA PARA ACTUALIZAR PACIENTE (PUT) - Nuestro objetivo final
router.put(
    '/:id', 
    authMiddleware, 
    roleMiddleware(['ADMIN', 'NURSE', 'DOCTOR']), 
    patientController.updatePatient
);

// RUTA PARA ELIMINAR PACIENTE
router.delete(
    '/:id', 
    authMiddleware, 
    roleMiddleware(['ADMIN']), 
    patientController.deletePatient
);


module.exports = router;