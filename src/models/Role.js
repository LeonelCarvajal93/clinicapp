const { DataTypes } = require('sequelize');
const db = require('../config/database'); // IMPORTACIÓN DIRECTA de la instancia de Sequelize

const Role = db.define('Role', {
    role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'Roles',
    timestamps: true
});

module.exports = Role;