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

// Middleware para servir arquivos estáticos (ex: imagens, CSS, JS)
app.use(express.static('public'));

// Middleware para permitir receber JSON no body das requisições
app.use(express.json());

// Rota para retornar produtos por categoria
app.get('/produtos/:categoria', (req, res) => {
    const categoria = req.params.categoria.toLowerCase();

    // Verificar se a categoria existe
    const categoriasValidas = ['ofertas', 'brincos', 'pulseiras', 'braceletes', 'colares', 'aneis'];

    if (!categoriasValidas.includes(categoria)) {
        return res.status(400).json({ error: 'Categoria inválida' });
    }

    const query = `SELECT * FROM ${categoria}`;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao consultar os produtos:', err);
            return res.status(500).json({ error: 'Erro ao consultar os produtos' });
        }
        res.json(results);
    });
});

// Rota para retornar produto pelo ID na categoria
app.get('/produto/:categoria/:id', (req, res) => {
    const categoria = req.params.categoria.toLowerCase();
    const idProduto = req.params.id;

    // Verificar se a categoria existe
    const categoriasValidas = ['ofertas', 'brincos', 'pulseiras', 'braceletes', 'colares', 'aneis'];

    if (!categoriasValidas.includes(categoria)) {
        return res.status(400).json({ error: 'Categoria inválida' });
    }

    // Consultar o produto na tabela da categoria
    const query = `SELECT * FROM ${categoria} WHERE id = ?`;

    connection.query(query, [idProduto], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o produto:', err);
            return res.status(500).json({ error: 'Erro ao consultar o produto' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json(results[0]); // Retorna o produto encontrado
    });
});

// Rota para atualizar o estoque após adicionar ao carrinho
app.post('/atualizar-estoque', (req, res) => {
    const { id, categoria, quantidade } = req.body;

    if (!id || !categoria || !quantidade) {
        return res.status(400).json({ sucesso: false, erro: 'Dados inválidos' });
    }

    // Verifica se a categoria é válida
    const categoriasValidas = ['ofertas', 'brincos', 'pulseiras', 'braceletes', 'colares', 'aneis'];
    if (!categoriasValidas.includes(categoria.toLowerCase())) {
        return res.status(400).json({ sucesso: false, erro: 'Categoria inválida' });
    }

    const query = `UPDATE ${categoria} SET quantidade = quantidade - ? WHERE id = ? AND quantidade >= ?`;

    connection.query(query, [quantidade, id, quantidade], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar estoque:', err);
            return res.status(500).json({ sucesso: false, erro: 'Erro no servidor' });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({ sucesso: false, erro: 'Estoque insuficiente ou produto não encontrado.' });
        }

        res.json({ sucesso: true });
    });
});

// Rota para inserir um novo pedido
app.post('/pedidos', (req, res) => {
    const {
        foto, nome, cor, tamanho, preco, quantidade,
        nome_cliente, CEP, rua_avenida, bairro,
        numero, complemento, telefone,
        forma_pagamento 
    } = req.body;

    const preco_total = preco * quantidade;

    const sql = `
      INSERT INTO pedidos (
        foto, nome, cor, tamanho, preco_total, quantidade,
        nome_cliente, CEP, rua_avenida, bairro,
        numero, complemento, telefone,
        forma_pagamento
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        foto, nome, cor, tamanho, preco_total, quantidade,
        nome_cliente, CEP, rua_avenida, bairro,
        numero, complemento, telefone,
        forma_pagamento
    ];

    connection.query(sql, valores, (err, result) => {
        if (err) {
            console.error('Erro ao inserir pedido:', err);
            return res.status(500).json({ erro: 'Erro ao inserir pedido.' });
        }

        res.status(201).json({ mensagem: 'Pedido inserido com sucesso.' });
    });
});


// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
