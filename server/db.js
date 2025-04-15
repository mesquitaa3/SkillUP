const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect(err => {
    if (err) {
        console.error("Erro ao conectar ao MariaDB:", err);
    } else {
        console.log("✅ Conectado ao MariaDB!");
    }
});

module.exports = db;
