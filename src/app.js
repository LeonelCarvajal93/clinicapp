const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/database'); // Importamos la conexión a BD
const db = require('./models'); // Importamos el nuevo 'index' de modelos para la sincronización

// Importamos las rutas de autenticación
const authRoutes = require('./routes/authRoutes'); 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware básicos de Express
app.use(express.json()); // Permite a Express leer cuerpos JSON
app.use(cors()); // Permite peticiones desde el frontend

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de Clínica Médica Funcionando');
});

// Middleware para usar las rutas de autenticación
// Todas las peticiones a /api/auth/ serán manejadas por authRoutes
app.use('/api/auth', authRoutes);

// Función principal de inicio: 1. Conectar a BD, 2. Sincronizar Modelos, 3. Iniciar Servidor
const startServer = async () => {
    try {
        // 1. Conectar a la base de datos
        await connectDB(); 

        // 2. Sincronizar modelos con la BD (crea las tablas si no existen)
        // Usamos 'false' para no borrar los datos en cada inicio.
        await db.syncModels(false); 

        // 3. Iniciar el servidor Express
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });

    } catch (err) {
        console.error("Fallo al iniciar la aplicación:", err);
        // Salir de la aplicación si hay un fallo crítico (ej. la BD no está encendida)
        process.exit(1); 
    }
};

// Llamada para arrancar la aplicación
startServer();