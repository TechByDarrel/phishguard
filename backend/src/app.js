const express = require("express");
const cors = require("cors");
const pool = require("./db/db");
const urlRoutes = require("./routes/urlRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

app.use("/api", urlRoutes);

app.get("/", (req, res) => {
  res.send("PhishGuard backend is running");
});

app.get("/api/health", async (req, res) => {
  try {
    const db = await pool.query("SELECT NOW()");
    res.status(200).json({
      success: true,
      message: "PhishGuard API is healthy",
      databaseTime: db.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message || String(error),
      code: error.code || null,
      detail: error.detail || null,
    });
  }
});

module.exports = app;