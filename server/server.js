const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Configuração do banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
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

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

// Middleware para receber JSON no body
app.use(express.json());

// Rota para retornar produtos por categoria
app.get('/produtos/:categoria', (req, res) => {
    const categoria = req.params.categoria.toLowerCase();
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

// Rota para retornar produto por ID
app.get('/produto/:categoria/:id', (req, res) => {
    const categoria = req.params.categoria.toLowerCase();
    const idProduto = req.params.id;
    const categoriasValidas = ['ofertas', 'brincos', 'pulseiras', 'braceletes', 'colares', 'aneis'];

    if (!categoriasValidas.includes(categoria)) {
        return res.status(400).json({ error: 'Categoria inválida' });
    }

    const query = `SELECT * FROM ${categoria} WHERE id = ?`;

    connection.query(query, [idProduto], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o produto:', err);
            return res.status(500).json({ error: 'Erro ao consultar o produto' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json(results[0]);
    });
});

// Rota para atualizar o estoque
app.post('/atualizar-estoque', (req, res) => {
    const { id, categoria, quantidade } = req.body;
    const categoriasValidas = ['ofertas', 'brincos', 'pulseiras', 'braceletes', 'colares', 'aneis'];

    if (!id || !categoria || !quantidade) {
        return res.status(400).json({ sucesso: false, erro: 'Dados inválidos' });
    }

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
        pedidoId, foto, nome, cor, tamanho, preco, quantidade,
        nome_cliente, CEP, rua_avenida, bairro,
        numero, complemento, telefone,
        forma_pagamento
    } = req.body;

    const preco_total = preco * quantidade;
    const status = "pendente"; // novo campo

    const sql = `
      INSERT INTO pedidos (
        pedidoId, foto, nome, cor, tamanho, preco_total, quantidade,
        nome_cliente, CEP, rua_avenida, bairro,
        numero, complemento, telefone,
        forma_pagamento, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        pedidoId, foto, nome, cor, tamanho, preco_total, quantidade,
        nome_cliente, CEP, rua_avenida, bairro,
        numero, complemento, telefone,
        forma_pagamento, status
    ];

    connection.query(sql, valores, (err, result) => {
        if (err) {
            console.error('Erro ao inserir pedido:', err);
            return res.status(500).json({ erro: 'Erro ao inserir pedido.' });
        }

        res.status(201).json({ mensagem: 'Pedido inserido com sucesso.' });
    });
});

// Rota para listar todos os pedidos
app.get('/pedidos', (req, res) => {
    const sql = `SELECT * FROM pedidos ORDER BY id DESC`;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar pedidos:', err);
            return res.status(500).json({ erro: 'Erro ao buscar pedidos.' });
        }

        res.json({ pedidos: results });
    });
});

// Rota para cancelar um pedido (remover todos os itens com o mesmo pedidoId)
app.delete('/pedidos/:pedidoId', (req, res) => {
    const pedidoId = req.params.pedidoId;

    const sql = `DELETE FROM pedidos WHERE pedidoId = ?`;

    connection.query(sql, [pedidoId], (err, result) => {
        if (err) {
            console.error('Erro ao cancelar pedido:', err);
            return res.status(500).json({ erro: 'Erro ao cancelar pedido.' });
        }

        res.json({ mensagem: 'Pedido cancelado com sucesso.' });
    });
});

// Rota para atualizar o status de um pedido (ex: marcar como entregue)
app.put('/pedidos/:pedidoId/status', (req, res) => {
    const pedidoId = req.params.pedidoId;
    const { status } = req.body;

    const sql = `UPDATE pedidos SET status = ? WHERE pedidoId = ?`;

    connection.query(sql, [status, pedidoId], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar status do pedido:', err);
            return res.status(500).json({ erro: 'Erro ao atualizar status do pedido.' });
        }

        res.json({ mensagem: 'Status do pedido atualizado com sucesso.' });
    });
});




// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
