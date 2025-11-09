// Archivo: backend/src/middleware/roleMiddleware.js

/**
 * Middleware para restringir el acceso basado en el rol del usuario.
 * @param {Array<string>} roles - Roles permitidos para acceder a la ruta (ej: ['ADMIN', 'NURSE'])
 */
module.exports = function (roles) {
    return (req, res, next) => {
        // 1. Verificar si el objeto de usuario está adjunto a la petición (proviene de authMiddleware)
        if (!req.user || !req.user.role) {
            return res.status(401).json({ msg: 'Acceso denegado. Rol de usuario no encontrado.' });
        }

        const userRole = req.user.role.toUpperCase();

        // 2. Verificar si el rol del usuario está incluido en el array de roles permitidos
        if (!roles.includes(userRole)) {
            // 403: Forbidden (Prohibido, el usuario está autenticado pero no tiene permiso)
            return res.status(403).json({ msg: 'Permiso denegado. Su rol no tiene acceso a esta función.' });
        }

        // 3. Si el rol está permitido, continuar con el siguiente middleware/controlador
        next();
    };
};