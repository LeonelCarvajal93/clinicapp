const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

// CONFIGURACIÓN DE RUTA (Verificado como correcto: sube 1 nivel a src, entra a config)
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const db = {};

// INICIALIZAR SEQUELIZE
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// CARGAR MODELOS (Adaptado a tu estilo de definición directa: sequelize.define)
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== path.basename(__filename) &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    // REQUIERE el modelo y lo agrega a la colección 'db'
    // Como tus modelos usan sequelize.define(), requerirlos devuelve el objeto Model.
    const model = require(path.join(__dirname, file)); 
    db[model.name] = model;
  });


// ASOCIACIONES (Resuelve el error 'no existe la columna registeredBy.id')

// Itera sobre todos los modelos cargados y aplica las asociaciones
Object.keys(db).forEach(modelName => {
    // Si el modelo es Patient o User, define explícitamente la asociación
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// Definición explícita de la asociación crítica (User <-> Patient)
// User tiene muchos Patients (registeredBy)
db.User.hasMany(db.Patient, {
  foreignKey: 'registered_by_user_id',
  as: 'registeredBy' 
});

// Patient pertenece a un User (el que lo registró)
db.Patient.belongsTo(db.User, {
  foreignKey: 'registered_by_user_id',
  as: 'registeredBy' 
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
