const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "petshop_db",
    waitForConnections: true,
});

// Testar conexão
pool.getConnection()
    .then(connection => {
        console.log("Conectado ao banco de dados MySQL");
        connection.release();
    })
    .catch(err => {
        console.error("Erro ao conectar ao banco:", err);
    });

module.exports = pool;