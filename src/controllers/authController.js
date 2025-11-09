// Archivo: backend/src/controllers/authController.js

const db = require('../models');
const User = db.User; // Accedemos al modelo User
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ---------------------------------------------------------------------
// 1. Función de Registro
// ---------------------------------------------------------------------
exports.registerUser = async (req, res) => {
    // 1. Desestructuración de los datos del cuerpo de la petición
    const { email, password, first_name, last_name, role } = req.body;

    // 2. Validación básica
    if (!email || !password || !first_name || !last_name || !role) {
        return res.status(400).json({ msg: 'Por favor, ingrese todos los campos requeridos.' });
    }

    try {
        // 3. Verificar si el usuario ya existe
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe con este correo electrónico.' });
        }

        // 4. Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Crear el nuevo usuario en la base de datos
        user = await User.create({
            email,
            password: hashedPassword, // Guardamos la contraseña encriptada
            first_name,
            last_name,
            role: role.toUpperCase() // Aseguramos que el rol esté en mayúsculas
        });

        // 6. Generar el JWT para iniciar sesión inmediatamente
        const payload = {
            user: {
                id: user.user_id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, // Token expira en 1 hora
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ msg: 'Usuario registrado exitosamente', token });
            }
        );

    } catch (error) {
        console.error("Error en registerUser:", error);
        res.status(500).json({ msg: 'Error del servidor al registrar usuario.', details: error.message });
    }
};

// ---------------------------------------------------------------------
// 2. Función de Inicio de Sesión
// ---------------------------------------------------------------------
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Verificar si el usuario existe
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ msg: 'Credenciales inválidas.' });
        }

        // 2. Comparar la contraseña ingresada con el hash guardado
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas.' });
        }

        // 3. Generar el JWT para la sesión
        const payload = {
            user: {
                id: user.user_id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    msg: 'Inicio de sesión exitoso', 
                    token,
                    user: {
                        id: user.user_id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        role: user.role
                    } 
                });
            }
        );

    } catch (error) {
        console.error("Error en loginUser:", error);
        res.status(500).json({ msg: 'Error del servidor al iniciar sesión.', details: error.message });
    }
};