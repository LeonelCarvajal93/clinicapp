const { DataTypes } = require('sequelize');
const db = require('../config/database'); // Importación corregida (pasos anteriores)

const User = db.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // ¡CRÍTICO! ESTA COLUMNA ES LA QUE ESTABA DANDO EL ERROR
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    first_name: { // Necesario porque lo inserta en sync_db.js
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: { // Necesario porque lo inserta en sync_db.js
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('ADMIN', 'NURSE', 'DOCTOR'), // ENUM corregido
        allowNull: false
    }
}, {
    tableName: 'Users',
    timestamps: true
});

module.exports = User;