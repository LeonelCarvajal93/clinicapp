const jwt = require('jsonwebtoken');

/**
 * Middleware para validar el token JWT en las peticiones seguras.
 * Busca el token en el encabezado estándar 'Authorization: Bearer <token>'
 */
const authMiddleware = (req, res, next) => {
    // 1. Obtener el valor del header 'Authorization'
    const authHeader = req.header('Authorization');

    // 2. Verificar si el header Authorization está presente
    if (!authHeader) {
        return res.status(401).json({ msg: 'No hay token, autorización denegada' });
    }

    // 3. Verificar el formato 'Bearer TOKEN' y extraer solo el token
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
        return res.status(401).json({ msg: 'Formato de token no válido. Use el formato: Bearer [token]' });
    }

    const token = parts[1]; // El token es la segunda parte del array

    // 4. Verificar el token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Adjuntar los datos decodificados (id y role) del token a la petición
        req.user = decoded.user;
        
        // 5. Continuar al siguiente middleware (roleMiddleware o el controlador)
        next();

    } catch (err) {
        // Esto se ejecuta si el token es inválido o ha expirado
        console.error("Error al verificar token:", err.message);
        res.status(401).json({ msg: 'Token no válido o ha expirado' });
    }
};

// -------------------------------------------------------------
// ESTA FUNCIÓN ESTÁ SEPARADA DE LA ANTERIOR (EL ARREGLO)
// -------------------------------------------------------------

/**
 * Middleware para verificar si el rol del usuario autenticado 
 * está incluido en la lista de roles permitidos.
 * @param {Array<string>} roles - Array de roles permitidos.
 */
function roleMiddleware(roles) {
    return (req, res, next) => {
        // req.user viene de authMiddleware
        if (!req.user || !req.user.role) {
            return res.status(401).json({ msg: 'Acceso denegado. No se encontró información de rol.' });
        }

        // Convertir el rol del usuario a mayúsculas para asegurar la comparación
        const userRole = req.user.role.toUpperCase();

        // Verificar si el rol del usuario está en la lista de roles permitidos
        if (!roles.includes(userRole)) {
            return res.status(403).json({ msg: 'Permiso denegado. Su rol no tiene acceso a esta función.' });
        }
        next();
    };
}


module.exports = {
    authMiddleware,
    roleMiddleware
};