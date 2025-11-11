const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

const authMiddleware = async (req, res, next) => {
    let token;

    // 1. Verificar si el token existe y tiene formato Bearer
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extraer el token (quitar "Bearer ")
            token = req.headers.authorization.split(' ')[1];

            // 2. Verificar el token usando process.env.JWT_SECRET (la clave CLAVE_SECRETA)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // 3. Buscar el usuario por ID dentro del token
            // CRÍTICO: El token decodificado contiene el ID del usuario (decoded.id)
            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });

            // 4. Si no se encuentra el usuario, devuelve un error específico
            if (!req.user) {
                // Este error ocurre si el token es VÁLIDO pero el ID de usuario no existe en la BD
                return res.status(401).json({ 
                    msg: 'Error de Autenticación: Usuario no encontrado en la base de datos.',
                    details: 'El ID dentro del token no corresponde a un usuario activo.'
                });
            }

            // Si todo está bien (token válido y usuario encontrado), pasamos al controlador
            next();

        } catch (error) {
            // Este bloque maneja 'invalid token', 'jwt expired', y errores de firma.
            console.error('Error de autenticación:', error.message);
            // Devolvemos el 401 que usted ha estado viendo
            return res.status(401).json({ 
                msg: 'Error: Token fallido o expirado.', 
                details: error.message 
            });
        }
    }
     else {
        // Si no hay token en el header
        return res.status(401).json({ msg: 'Error: No se proporcionó token de autorización.' });
    }
};

module.exports = authMiddleware;