const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function createTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS url_checks (
        id SERIAL PRIMARY KEY,
        url TEXT NOT NULL,
        risk_score INT NOT NULL,
        level VARCHAR(20) NOT NULL,
        findings TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(query);
    console.log("url_checks table created successfully");
  } catch (error) {
    console.error("Error creating table:", error);
  } finally {
    await pool.end();
  }
}

createTable();