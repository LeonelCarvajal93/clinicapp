const { DataTypes } = require('sequelize');
const db = require('../config/database'); // Importación directa de la instancia de Sequelize
const User = require('./user');

const Patient = db.define('Patient', {
    patient_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,
        }
    },
    // CORRECCIÓN CRÍTICA: Se añaden los valores 'M' y 'F' para que el registro funcione.
    gender: {
        type: DataTypes.ENUM('M', 'F', 'OTHER', 'O'), 
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    emergency_contact_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    emergency_contact_phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    blood_type: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']]
        }
    },
    registered_by_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, 
            key: 'user_id'
        }
    }
}, {
    tableName: 'Patients',
    timestamps: true
});

// Definir la asociación
Patient.belongsTo(User, { foreignKey: 'registered_by_user_id', as: 'RegisteredBy' });
User.hasMany(Patient, { foreignKey: 'registered_by_user_id', as: 'RegisteredPatients' });

module.exports = Patient;