// db.js
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "admin123",
  database: process.env.DB_NAME || "skillup",
  port: process.env.DB_PORT || 3307
});

db.connect(err => {
  if (err) {
    console.error("❌ Erro ao conectar ao MariaDB:", err);
  } else {
    console.log("✅ Conectado ao MariaDB!");
  }
});

module.exports = db;
