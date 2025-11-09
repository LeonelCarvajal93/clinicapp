// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importamos el modelo User
// Secreto para firmar JWT (¡Múevete a un .env en producción!)
const jwtSecret = 'tu_secreto_super_seguro'; 

// Función para registrar un nuevo usuario (Signup)
exports.registerUser = async (req, res) => {
    const { email, password, first_name, last_name, role_id } = req.body;

    try {
        // 1. Verificar si el usuario ya existe
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe con ese correo.' });
        }

        // 2. Hashear la contraseña antes de guardarla
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // 3. Crear el nuevo usuario en la BD usando el modelo User de Sequelize
        user = await User.create({
            email,
            password_hash,
            first_name,
            last_name,
            role_id: role_id || 2, // Asigna un rol por defecto (ej. rol_id 2 puede ser 'Enfermería')
            is_active: true,
        });

        // 4. Generar el Token de Autenticación (JWT)
        const payload = {
            user: {
                id: user.user_id,
                role_id: user.role_id
            }
        };

        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: '1h' }, // El token expira en 1 hora
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ 
                    msg: 'Usuario registrado exitosamente',
                    token: token,
                    user_id: user.user_id 
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del Servidor');
    }
};

// Dejamos espacio aquí para la función de login que haremos a continuación...
