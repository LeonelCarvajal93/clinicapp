// Archivo: backend/src/models/index.js
const { sequelize } = require('../config/database');

// 1. Importar los modelos (deben estar definidos en esta misma carpeta)
const User = require('./User');
const Role = require('./Role'); 

// 2. Definir un objeto contenedor
const db = {
    sequelize,
    User,
    Role,
};

/**
 * Función que sincroniza los modelos con la base de datos.
 * Esto crea las tablas si no existen.
 * @param {boolean} force - Si es true, BORRA y RECREA las tablas.
 */
db.syncModels = async (force = false) => {
    try {
        // Sincroniza la base de datos con los modelos.
        await sequelize.sync({ force: force });
        console.log("Modelos sincronizados y BD actualizada.");

    } catch (error) {
        console.error("Error al sincronizar modelos:", error);
        throw error;
    }
};

module.exports = db;