const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Configuração do banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'loja_ruby',
});

// Conectar ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        return;
    }
    console.log('Conexão com o banco de dados realizada com sucesso!');
});

// Definir uma rota para recuperar os produtos
app.get('/produtos', (req, res) => {
    const query = 'SELECT * FROM produtos'; // Certifique-se de que a tabela e os campos estão corretos
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao recuperar os produtos');
        }
        res.json(results); // Envia os produtos como JSON
    });
});

// Servir arquivos estáticos (como HTML, CSS e JS)
app.use(express.static('public'));

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
