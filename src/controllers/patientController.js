// Archivo: backend/src/controllers/patientController.js (Versión Simple para Lectura)
const db = require('../models');
const Patient = db.Patient;
const User = db.User; 
const { Op } = require('sequelize');

// Función para registrar un nuevo paciente
exports.createPatient = async (req, res) => {
    // El 'registered_by_user_id' se obtiene del token JWT verificado en el middleware
    const registered_by_user_id = req.user.id; 
    const { 
        first_name, last_name, birth_date, gender, 
        phone, address, emergency_contact_name, 
        emergency_contact_phone, blood_type 
    } = req.body;

    try {
        const patient = await Patient.create({
            first_name, last_name, birth_date, gender, 
            phone, address, emergency_contact_name, 
            emergency_contact_phone, blood_type, 
            registered_by_user_id // Asignado automáticamente
        });
        
        // Excluimos la clave foránea del resultado para una respuesta limpia
        const responsePatient = patient.toJSON();
        delete responsePatient.registered_by_user_id;

        res.status(201).json({ 
            msg: 'Paciente registrado exitosamente.', 
            patient: responsePatient 
        });

    } catch (error) {
        console.error("Error al crear paciente:", error);
        res.status(500).json({ 
            msg: 'Error del servidor al registrar paciente.',
            details: error.message 
        });
    }
};

// Función para obtener todos los pacientes o buscar por nombre
exports.getPatients = async (req, res) => {
    // Permite buscar por nombre o apellido
    const { search } = req.query; 

    try {
        let whereClause = {};

        if (search) {
            // Utilizamos el operador OR de Sequelize para buscar en ambos campos
            whereClause = {
                [Op.or]: [
                    { first_name: { [Op.iLike]: `%${search}%` } }, // Búsqueda insensible a mayúsculas
                    { last_name: { [Op.iLike]: `%${search}%` } }
                ]
            };
        }

        const patients = await Patient.findAll({
            where: whereClause,
            // Incluimos información del usuario que lo registró para contexto
            include: [{
                model: User,
                as: 'registeredBy',
                attributes: ['user_id', 'first_name', 'last_name', 'role', 'email'] // Solo información relevante
            }],
            attributes: { exclude: ['registered_by_user_id'] } // Excluimos la clave foránea
        });

        res.status(200).json(patients);

    } catch (error) {
        console.error("Error al obtener pacientes:", error);
        res.status(500).json({ 
            msg: 'Error del servidor al obtener listado de pacientes.',
            details: error.message 
        });
    }
};

// Nota: Aquí se añadirían funciones para getPatientById, updatePatient, y deletePatient.