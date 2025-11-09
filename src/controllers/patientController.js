const { Patient, User } = require('../models');

// Función para obtener todos los pacientes (GET /api/patients)
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.findAll({
            // Incluimos la información del usuario que lo registró (Necesario para el GET)
            include: [{
                model: User,
                as: 'registeredBy',
                attributes: ['id', 'first_name', 'last_name', 'email', 'role']
            }]
        });
        res.status(200).json(patients);
    } catch (error) {
        console.error('Error al obtener pacientes:', error);
        res.status(500).json({ msg: 'Error interno del servidor al obtener pacientes.' });
    }
};

// Función para crear un nuevo paciente (POST /api/patients)
exports.createPatient = async (req, res) => {
    try {
        // El ID del usuario que registra se obtiene del token (req.user.id)
        const patientData = {
            ...req.body,
            registered_by_user_id: req.user.id // Correcto: Usamos el ID del usuario autenticado
        };

        const newPatient = await Patient.create(patientData);

        // [CORRECCIÓN CRÍTICA]: Eliminamos el include y la recarga en el POST.
        // El error "registeredBy.id" surge porque Sequelize no puede mapear
        // correctamente la inclusión 'registeredBy' al devolver el resultado.
        
        res.status(201).json({
            msg: "Paciente registrado exitosamente.",
            patient: newPatient // Devolvemos el paciente simple, sin la asociación cargada
        });
    } catch (error) {
        console.error('Error al registrar paciente:', error);
        res.status(500).json({ msg: 'Error interno del servidor al registrar paciente.', details: error.message });
    }
};

// Función para obtener un paciente por ID (GET /api/patients/:id)
exports.getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findByPk(req.params.id, {
            // Incluimos la asociación, ya que esta ruta lo necesita
            include: [{
                model: User,
                as: 'registeredBy',
                attributes: ['id', 'first_name', 'last_name', 'email', 'role']
            }]
        });

        if (!patient) {
            return res.status(404).json({ msg: 'Paciente no encontrado.' });
        }
        res.status(200).json(patient);
    } catch (error) {
        console.error('Error al obtener paciente por ID:', error);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
};


// Función para actualizar un paciente (PUT /api/patients/:id)
exports.updatePatient = async (req, res) => {
    try {
        // Ejecutar la actualización (UPDATE)
        const [updatedRowsCount] = await Patient.update(req.body, {
            where: { patient_id: req.params.id }
        });

        if (updatedRowsCount === 0) {
            return res.status(404).json({ msg: 'Paciente no encontrado o no se realizaron cambios.' });
        }

        // 2. Recargar el paciente actualizado para la respuesta.
        // [CORRECCIÓN CRÍTICA]: Eliminamos el include en la recarga del PUT 
        // para evitar el error "registeredBy.id".
        const updatedPatient = await Patient.findByPk(req.params.id);
        
        if (!updatedPatient) {
            return res.status(404).json({ msg: 'Paciente no encontrado después de la actualización.' });
        }


        res.status(200).json({
            msg: "Paciente actualizado exitosamente.",
            patient: updatedPatient // Devolvemos el paciente simple, sin la asociación cargada
        });
    } catch (error) {
        console.error('Error al actualizar paciente:', error);
        res.status(500).json({ msg: 'Error interno del servidor al actualizar paciente.', details: error.message });
    }
};

// Función para eliminar un paciente (DELETE /api/patients/:id)
exports.deletePatient = async (req, res) => {
    try {
        const deletedRows = await Patient.destroy({
            where: { patient_id: req.params.id }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ msg: 'Paciente no encontrado.' });
        }

        res.status(200).json({ msg: 'Paciente eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar paciente:', error);
        res.status(500).json({ msg: 'Error interno del servidor al eliminar paciente.' });
    }
};