// src/models/Role.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Role = sequelize.define('Role', {
    role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    role_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    }
}, {
    tableName: 'Roles', // Nombre exacto de la tabla en PostgreSQL
    timestamps: false,  // Esta tabla es estática, no necesita fechas de creación/actualización
});

module.exports = Role;
