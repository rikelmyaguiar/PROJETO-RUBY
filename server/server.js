const mysql = require('mysql2');

// Configurações do banco de dados
const connection = mysql.createConnection({
    host: 'localhost',     // Endereço do servidor
    user: 'root',          // Usuário do MySQL
    password: '',          // Senha do MySQL
    database: 'loja_ruby', // Nome do banco de dados
});

// Conecta ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        return;
    }
    console.log('Conexão com o banco de dados realizada com sucesso!');
});

module.exports = connection;
