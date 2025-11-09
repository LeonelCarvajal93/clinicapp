// Archivo: backend/src/models/index.js (CORREGIDO)

const { sequelize } = require('../config/database');

// 1. Importar todos los modelos (Aseguramos que la ruta sea relativa)
const User = require('./User');
const Role = require('./Role'); 
const Patient = require('./Patient'); 

// 2. Definir las Asociaciones (Relaciones)

// Un User (Doctor/Admin) registra a muchos Patient
User.hasMany(Patient, {
    foreignKey: 'registered_by_user_id', 
    as: 'registeredPatients', // Alias para incluir en consultas
});

// Un Patient solo puede ser registrado por un User
Patient.belongsTo(User, {
    foreignKey: 'registered_by_user_id',
    as: 'registeredBy', // Alias para incluir en consultas
});

// 3. Definir un objeto contenedor para exportar todo lo necesario.
const db = {
    sequelize,
    User,
    Role,
    Patient, // Exportamos el modelo Patient
};

/**
 * Función para sincronizar modelos con la base de datos (crear tablas si no existen)
 * @param {boolean} force - Si es true, BORRA y RECREA todas las tablas. Usar con cautela.
 */
db.syncModels = async (force = false) => {
    try {
        await sequelize.sync({ force: force });
        console.log("Modelos sincronizados y BD actualizada.");

    } catch (error) {
        console.error("Error al sincronizar modelos:", error);
        throw error;
    }
};

module.exports = db;