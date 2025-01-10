const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Configuração do banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',  // Nenhuma senha
    database: 'loja_ruby'
});

// Conectando ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        return;
    }
    console.log('Conexão com o banco de dados realizada com sucesso!');
});

// Rota para retornar produtos por categoria
app.get('/produtos/:categoria', (req, res) => {
    const categoria = req.params.categoria.toLowerCase();

    // Verificar se a categoria existe
    const categoriasValidas = ['ofertas', 'brincos', 'pulseiras', 'braceletes', 'colares', 'aneis']; // Nomes das tabelas

    if (!categoriasValidas.includes(categoria)) {
        return res.status(400).json({ error: 'Categoria inválida' });
    }

    // Consulta à tabela correspondente
    const query = `SELECT * FROM ${categoria}`;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao consultar os produtos:', err);
            return res.status(500).json({ error: 'Erro ao consultar os produtos' });
        }
        res.json(results);
    });
});

// Servir arquivos estáticos
app.use(express.static('public'));

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
