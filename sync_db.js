const db = require('./src/models');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt'); 
// Se utiliza la desestructuración para acceder al modelo User
const { User } = require('./src/models'); 

dotenv.config();

/**
 * Script para forzar la Sincronización (destrucción y recreación) de la base de datos.
 * ADVERTENCIA: ¡Esto borra todos los datos!
 */
async function forceSyncDatabase() {
    try {
        // 1. Generar la contraseña hasheada para los usuarios por defecto
        const saltRounds = 10;
        const passwordAdmin = '123456';
        const hashedPassword = await bcrypt.hash(passwordAdmin, saltRounds);

        // La opción { force: true } hace el DROP TABLE y luego el CREATE TABLE
        console.log("Iniciando sincronización destructiva (force: true)...");
        
        // CORRECCIÓN: Usar db.sequelize.sync, ya que db.sequelize es la instancia de Sequelize en su archivo index.js
        await db.sequelize.sync({ force: true }); 
        
        console.log("¡Sincronización forzada completada!");
        console.log("Las tablas han sido borradas y recreadas con los últimos modelos.");

        // 2. CREAR USUARIOS INICIALES (ADMIN y DOCTOR)
        console.log("Creando usuarios iniciales...");

        await User.bulkCreate([
            {
                // CORRECCIÓN CRÍTICA: AÑADIMOS EL CAMPO 'username'
                username: 'admin', 
                first_name: 'Admin',
                last_name: 'Principal',
                email: 'admin@appmedical.com', // Correo para Login
                password: hashedPassword,
                role: 'ADMIN'
            },
            {
                // CORRECCIÓN CRÍTICA: AÑADIMOS EL CAMPO 'username'
                username: 'marco.lopez',
                first_name: 'Dr. Marco',
                last_name: 'Lopez',
                email: 'medico@appmedical.com', // Correo para Login
                password: hashedPassword,
                role: 'DOCTOR', 
            }
        ], { validate: true });

        console.log("Usuarios iniciales creados. Credenciales: email=admin@appmedical.com, password=123456");
        console.log("¡BASE DE DATOS LISTA PARA USAR!");

    } catch (error) {
        console.error("ERROR en la sincronización forzada:", error);
        process.exit(1);
    } finally {
        // Cierra la conexión a la base de datos
        // CORRECCIÓN: Usar db.sequelize.close()
        await db.sequelize.close(); 
        process.exit(0);
    }
}

// Ejecuta la función principal
forceSyncDatabase();