const db = require('../models');
const User = db.User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');

/**
 * Función auxiliar para generar el token JWT.
 */
const generateToken = (id, role) => {
    // CRÍTICO: Usa process.env.JWT_SECRET (CLAVE_SECRETA) para firmar el token
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

/**
 * @desc   Registra un nuevo usuario
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, email, password, role } = req.body;

    // 1. Verificar si el usuario ya existe
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
        res.status(400);
        throw new Error('El usuario ya existe');
    }

    // 2. Hash del password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Crear usuario
    const user = await User.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        role: role || 'NURSE', 
    });

    if (user) {
        res.status(201).json({
            message: 'Registro exitoso',
            user: {
                id: user.user_id,
                first_name: user.first_name,
                email: user.email,
                role: user.role,
            },
            token: generateToken(user.user_id, user.role),
        });
    } else {
        res.status(400);
        throw new Error('Datos de usuario inválidos');
    }
});


/**
 * @desc   Autenticar un usuario y obtener token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // 1. Buscar usuario por email
    const user = await User.findOne({ where: { email } });

    // 2. Verificar usuario y password
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            msg: 'Inicio de sesión exitoso',
            token: generateToken(user.user_id, user.role),
            user: {
                id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
            },
        });
    } else {
        res.status(401);
        throw new Error('Credenciales inválidas');
    }
});


module.exports = {
    registerUser,
    loginUser,
};