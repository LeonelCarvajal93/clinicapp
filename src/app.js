require('dotenv').config(); // CRÍTICO: Cargar .env primero

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// Conexión a la base de datos y sincronización de modelos
const connectDB = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Conexión a la base de datos establecida exitosamente.');
        await db.sequelize.sync({ alter: true }); // Sincroniza modelos
        console.log('Modelos sincronizados con la BD.');
        
        // Verificación de carga de secreto (para diagnóstico)
        if (process.env.JWT_SECRET) {
            console.log(`JWT Secret Cargado: ${process.env.JWT_SECRET}`);
        } else {
             // Si el secreto no carga, detenemos la ejecución y mostramos un error CLARO.
             console.error('ERROR CRÍTICO: JWT_SECRET no está cargado. Verifique su archivo .env');
             process.exit(1); 
        }

    } catch (error) {
        console.error('No se pudo conectar/sincronizar la BD:', error);
        process.exit(1);
    }
};

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);

// Manejador de errores personalizado
app.use(errorHandler);

// Iniciar servidor después de la conexión a la BD
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
});