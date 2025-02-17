const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;

async function connectToDatabase() {
    const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
    requiredEnvVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            console.error(`❌ Missing required environment variable: ${envVar}`);
            process.exit(1);
        }
    });

    try {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
        console.log("✅ Database connection pool created successfully.");
    } catch (err) {
        console.error("❌ Error creating connection pool");
        console.error(err);
        process.exit(1);
    }
}

exports.connectToDatabase = connectToDatabase;

exports.getPool = () => {
    if (!pool) {
        throw new Error("Database connection pool is not initialized.");
    }
    return pool;
};

// Graceful shutdown
process.on('SIGINT', async () => {
    if (pool) {
        console.log("Closing database connection pool...");
        await pool.end();
    }
    process.exit(0);
});