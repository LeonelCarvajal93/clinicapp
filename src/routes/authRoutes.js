const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Registrar un nuevo usuario
// @access  Public
router.post('/register', authController.registerUser);

// @route   POST /api/auth/login
// @desc    Autenticar usuario y obtener token
// @access  Public
router.post('/login', authController.loginUser); // ¡Ruta de login añadida!

module.exports = router;