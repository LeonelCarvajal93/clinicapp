const db = require('../models');
const Patient = db.Patient;
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');

/**
 * @desc   Obtener todos los pacientes registrados
 * @route   GET /api/patients
 * @access  Private (Requiere token)
 */
const getAllPatients = asyncHandler(async (req, res) => {
    // Si el middleware de rol estuviera activo, se encargaría de esto.
    if (req.user.role !== 'DOCTOR' && req.user.role !== 'ADMIN') {
        res.status(403);
        throw new Error('No autorizado. Solo Médicos y Administradores pueden ver la lista de pacientes.');
    }
    const patients = await Patient.findAll();
    res.status(200).json(patients);
});


/**
 * @desc   Registrar un nuevo paciente
 * @route   POST /api/patients
 * @access  Private (Requiere token)
 */
const registerPatient = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Verificación de rol (asumimos que req.user ya existe)
    if (req.user.role !== 'DOCTOR' && req.user.role !== 'ADMIN') {
        res.status(403);
        throw new Error('No autorizado. Solo Médicos y Administradores pueden registrar pacientes.');
    }

    // Extracción de datos del cuerpo (Postman)
    const { 
        first_name, 
        last_name, 
        date_of_birth, 
        gender, 
        phone_number 
    } = req.body;

    try {
        const patient = await Patient.create({
            first_name,
            last_name,
            birth_date: date_of_birth, 
            gender,
            phone_number,
            // CORRECCIÓN FINAL: Usamos req.user.user_id que es la PK del modelo User
            // El ID del usuario que viene del token (middleware)
            registered_by_user_id: req.user.user_id 
        });

        res.status(201).json({
            patient_id: patient.patient_id,
            first_name: patient.first_name,
            message: 'Paciente registrado exitosamente.'
        });
    } catch (error) {
        console.error('Error al registrar paciente:', error);

        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => {
                // Si el error es el ID de usuario nulo, lo manejamos mejor.
                if (err.path === 'registered_by_user_id' && err.message === 'Patient.registered_by_user_id cannot be null') {
                    return 'Error interno: El ID de usuario logueado no pudo ser asignado. Asegúrese de que su usuario exista en la BD.';
                }
                return err.message;
            });
            return res.status(400).json({ msg: 'Error de validación:', errors });
        }
        
        res.status(500).json({ msg: 'Error interno del servidor al registrar paciente.' });
    }
});


module.exports = {
    getAllPatients,
    registerPatient
};