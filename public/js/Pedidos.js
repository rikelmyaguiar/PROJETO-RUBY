document.addEventListener("DOMContentLoaded", function () {
    const pedidosContainer = document.getElementById("pedidos-container");
    const avisoSemPedidos = document.getElementById("aviso-sem-pedidos");
    const pedidosLista = document.getElementById("pedidos-lista");

    // Função para carregar os pedidos
    function carregarPedidos() {
        fetch("http://localhost:3000/pedidos")  // Aqui você faz a requisição para buscar os pedidos
            .then(res => {
                if (!res.ok) {
                    throw new Error('Erro ao carregar pedidos');
                }
                return res.json(); // Converte a resposta em JSON
            })
            .then(data => {
                console.log(data); // Verifique o que vem de volta da API
                if (data.pedidos && data.pedidos.length > 0) {
                    // Chama a função para exibir os pedidos na tela
                    renderizarPedidos(data.pedidos);
                } else {
                    // Se não houver pedidos, exibe a mensagem de aviso
                    avisoSemPedidos.style.display = "block";
                    pedidosLista.style.display = "none";
                }
            })
            .catch(error => {
                console.error('Erro ao buscar pedidos:', error);
                avisoSemPedidos.style.display = "block";
                pedidosLista.style.display = "none";
            });
    }

    // Função para renderizar os pedidos na tela
    function renderizarPedidos(pedidos) {
        // Exibe o contêiner de pedidos e esconde o aviso
        pedidosContainer.style.display = "block";
        avisoSemPedidos.style.display = "none";
        pedidosLista.style.display = "block";

        pedidosLista.innerHTML = ''; // Limpa a área antes de adicionar os pedidos
        pedidos.forEach(pedido => {
            const pedidoElement = document.createElement("div");
            pedidoElement.classList.add("pedido");

            pedidoElement.innerHTML = `
                <h3>Pedido ID: ${pedido.pedidoId}</h3>
                <p><strong>Nome Cliente:</strong> ${pedido.nome_cliente}</p>
                <p><strong>Status:</strong> ${pedido.status}</p>
                <p><strong>Preço Total:</strong> R$ ${pedido.preco_total}</p>
                <p><strong>Forma de pagamento:</strong> ${pedido.forma_pagamento}</p>
                <p><strong>Endereço:</strong> ${pedido.rua_avenida}, ${pedido.bairro}, ${pedido.CEP}</p>
                <hr>
            `;

            pedidosLista.appendChild(pedidoElement);
        });
    }

    // Chama a função ao carregar a página
    carregarPedidos();
});
