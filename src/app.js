// Archivo: backend/src/app.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/database'); // Importamos la conexión a BD
const db = require('./models'); // Importamos el index de modelos para la sincronización

// Importamos las rutas de autenticación
const authRoutes = require('./routes/authRoutes'); 
// NUEVA LÍNEA: Importamos las rutas del módulo de Pacientes
const patientRoutes = require('./routes/patientRoutes'); 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware básicos de Express
app.use(express.json()); 
app.use(cors()); 

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de Clínica Médica Funcionando');
});

// Middleware para usar las rutas de autenticación
app.use('/api/auth', authRoutes);

// NUEVA LÍNEA: Middleware para usar las rutas de pacientes
app.use('/api/patients', patientRoutes);

// Función principal de inicio: 1. Conectar a BD, 2. Sincronizar Modelos, 3. Iniciar Servidor
const startServer = async () => {
    try {
        // 1. Conectar a la base de datos
        await connectDB(); 

        // 2. Sincronizar modelos con la BD (crea las tablas si no existen)
        await db.sequelize.sync({ alter: true });
        console.log("Modelos sincronizados con la BD.");

        // 3. Iniciar el servidor Express
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });

    } catch (err) {
        console.error("Fallo al iniciar la aplicación:", err);
        process.exit(1); 
    }
};

// Llamada para arrancar la aplicación
startServer();