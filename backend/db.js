import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const testConnection = async ()=> {
  try {
    await pool.query("SELECT 1");
    console.log("connected to PostgreSQL");    
  }catch(error){
    console.error("DB Connection Error:", error);
  }
};

testConnection();

export default pool;