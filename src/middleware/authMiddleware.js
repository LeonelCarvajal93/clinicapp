// Archivo: backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// El secreto debe ser el mismo que el usado en authController.js y debe estar en .env
const jwtSecret = process.env.JWT_SECRET || 'SECRETO_POR_DEFECTO_MALA_PRACTICA'; 

// Esta función se ejecuta antes de que se acceda a una ruta protegida
module.exports = function (req, res, next) {
    // 1. Obtener el token del encabezado (header)
    // El token generalmente se envía como 'Bearer <token_string>'
    const token = req.header('x-auth-token');

    // 2. Verificar si no hay token
    if (!token) {
        // 401: Unauthorized (No autorizado, requiere autenticación)
        return res.status(401).json({ msg: 'No hay token, autorización denegada' });
    }

    try {
        // 3. Verificar el token usando el secreto
        // jwt.verify() decodifica el token y comprueba si la firma es válida
        const decoded = jwt.verify(token, jwtSecret);

        // 4. Adjuntar la información del usuario al objeto de la solicitud (req)
        // Esto permite a las funciones de ruta saber quién hizo la solicitud (id y rol).
        req.user = decoded.user;
        
        // 5. Continuar al siguiente middleware o a la función de la ruta
        next();
        
    } catch (err) {
        // Si el token es inválido (expirado, modificado, etc.)
        res.status(401).json({ msg: 'Token no es válido' });
    }
};