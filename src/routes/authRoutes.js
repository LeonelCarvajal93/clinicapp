// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Definimos la ruta POST para el registro de usuarios
// Endpoint: POST /api/auth/register
router.post('/register', authController.registerUser);

module.exports = router;
