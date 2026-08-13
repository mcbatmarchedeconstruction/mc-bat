import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    })
    : new Pool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

pool.connect()
    .then(client => {
        console.log("✅ Connexion PostgreSQL réussie");
        client.release();
    })
    .catch(error => {
        console.error("❌ Erreur PostgreSQL :", error);
    });
export default pool;