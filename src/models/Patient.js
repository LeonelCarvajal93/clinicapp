// Archivo: backend/src/models/Patient.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Patient = sequelize.define('Patient', {
    patient_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    first_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    birth_date: {
        type: DataTypes.DATEONLY, // Solo fecha (YYYY-MM-DD)
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM('Masculino', 'Femenino', 'Otro'),
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    emergency_contact_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    emergency_contact_phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    blood_type: {
        type: DataTypes.STRING(5),
        allowNull: true,
    },
    // Clave Foránea (FK) se añade automáticamente con la asociación en index.js
    // registered_by_user_id: { ... }
}, {
    tableName: 'Patients', 
    timestamps: true,
});

module.exports = Patient;