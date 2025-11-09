// src/app.js (Actualizado para conectar a BD)
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/database'); // Importamos la función connectDB
const { User, Role } = require('./src/models/associations') //Importamos los modelos asociados

// Importamos las nuevas rutas de autenticación
const authRoutes = require('./src/routes/authRoutes'); 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('API de Clínica Médica Funcionando');
});
// Middleware para usar las rutas de autenticación
// Todas las rutas aquí comenzarán con /api/auth
app.use('/api/auth', authRoutes);
// NUEVO: Llamamos a connectDB() antes de arrancar el servidor HTTP
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}).catch(err => {
    console.error("Fallo al iniciar la aplicación debido a error de BD", err);
});
