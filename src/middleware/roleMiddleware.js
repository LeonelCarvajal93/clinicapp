// Archivo: backend/src/middleware/roleMiddleware.js

/**
 * Middleware que verifica si el rol del usuario autenticado
 * está incluido en la lista de roles permitidos.
 * @param {string[]} allowedRoles - Un array de strings con los roles permitidos (ej: ['ADMIN', 'DOCTOR'])
 */
exports.permit = (allowedRoles) => {
    return (req, res, next) => {
        // El rol y el ID del usuario se adjuntan a 'req.user' en el authMiddleware
        const userRole = req.user && req.user.role; 

        if (!userRole) {
            // Este caso no debería ocurrir si authMiddleware funciona
            return res.status(500).json({ msg: "Error de servidor: No se pudo verificar el rol del usuario." });
        }

        if (allowedRoles.includes(userRole)) {
            // Si el rol está permitido, continúa con la ruta
            next();
        } else {
            // Si el rol no está en la lista
            res.status(403).json({ 
                msg: "Acceso denegado. No tiene permisos suficientes para realizar esta acción.",
                required_roles: allowedRoles,
                user_role: userRole
            });
        }
    };
};