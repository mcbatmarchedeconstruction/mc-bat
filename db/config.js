import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,
    // port: Number(process.env.DB_PORT)

    connectionString: process.env.DATABASE_URL_EXTERNAL,
    ssl: {
        rejectUnauthorized: false
    }
})
pool.connect()
    .then(client => {
        console.log("✅ Connexion PostgreSQL réussie");
        client.release();
    })
    .catch(error => {
        console.error("❌ Erreur PostgreSQL :", error);
    });
export default pool;