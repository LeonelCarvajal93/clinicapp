const db = require('../config/database');
const { DataTypes } = require('sequelize');

// --- 1. IMPORTAR MODELOS ---
// Importar cada modelo directamente con la instancia de Sequelize 'db'
const User = require('./user');
const Patient = require('./patient');
const Role = require('./Role'); // Asegúrese que el nombre del archivo es 'Role.js'

// --- 2. DEFINIR ASOCIACIONES ---
// Relación User (RegisteredBy) -> Patient (muchos a uno)
Patient.belongsTo(User, {
    foreignKey: 'registered_by_user_id',
    as: 'registered_by'
});
// La inversa para poder ver los pacientes registrados por un usuario
User.hasMany(Patient, {
    foreignKey: 'registered_by_user_id',
    as: 'patients_registered'
});


// Exportar objetos para usarlos en el resto de la aplicación
const models = {
    User,
    Patient,
    Role,
    sequelize: db, // Exportamos la instancia de sequelize
    Sequelize: DataTypes // Exportamos DataTypes si fuera necesario
};

module.exports = models;