// src/models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Role = require('./Role'); // Importamos el modelo Role

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true, // El email debe ser único para el login
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { // Creamos la relación (clave foránea) con la tabla Roles
            model: Role, 
            key: 'role_id',
        }
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'Users', // Nombre exacto de la tabla en PostgreSQL
    timestamps: true, // Sequelize añadirá automáticamente createdAt y updatedAt
});

// Definir explícitamente la relación en Sequelize
User.belongsTo(Role, { foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'role_id' });

module.exports = User;
