// Archivo: backend/src/models/User.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    first_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('ADMIN', 'DOCTOR', 'NURSE', 'PATIENT_MANAGER'),
        allowNull: false,
        defaultValue: 'NURSE' 
    }
}, {
    tableName: 'Users', 
    timestamps: true,
});

module.exports = User;