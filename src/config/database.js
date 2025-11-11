const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres', 
        logging: false,
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida exitosamente.');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};

// CORRECCIÓN: Exportar la instancia de Sequelize directamente
module.exports = sequelize;
// Si necesita acceder a connectDB en otro lado, use: module.exports.connectDB = connectDB
