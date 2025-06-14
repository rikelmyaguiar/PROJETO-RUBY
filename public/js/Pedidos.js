document.addEventListener("DOMContentLoaded", function () {
    const pedidosContainer = document.getElementById("pedidos-container");
    const avisoSemPedidos = document.getElementById("aviso-sem-pedidos");
    const pedidosLista = document.getElementById("pedidos-lista");

    // Verifica se os elementos essenciais existem no DOM
    if (!pedidosContainer || !avisoSemPedidos || !pedidosLista) {
        console.error("Elementos da página de pedidos não encontrados.");
        return;
    }

    function carregarPedidos() {
        fetch("http://localhost:3000/pedidos")
            .then(res => {
                if (!res.ok) throw new Error("Erro ao carregar pedidos");
                return res.json();
            })
            .then(data => {
                if (data.pedidos && data.pedidos.length > 0) {
                    renderizarPedidos(data.pedidos);
                } else {
                    avisoSemPedidos.style.display = "block";
                    pedidosContainer.style.display = "none";
                }
            })
            .catch(error => {
                console.error("Erro ao buscar pedidos:", error);
                avisoSemPedidos.style.display = "block";
                pedidosContainer.style.display = "none";
            });
    }

    function renderizarPedidos(pedidos) {
        pedidosContainer.style.display = "block";
        avisoSemPedidos.style.display = "none";
        pedidosLista.innerHTML = '';

        // Agrupar por pedidoId
        const agrupados = {};
        pedidos.forEach(p => {
            if (!agrupados[p.pedidoId]) agrupados[p.pedidoId] = [];
            agrupados[p.pedidoId].push(p);
        });

        for (const pedidoId in agrupados) {
            const itens = agrupados[pedidoId];
            const total = itens.reduce((soma, item) => soma + Number(item.preco_total), 0);

            const div = document.createElement("div");
            div.classList.add("pedido");

            div.innerHTML = `
                <h3>Pedido #${pedidoId}</h3>
                <p><strong>Data:</strong> ${new Date(itens[0].data_pedido).toLocaleString()}</p>
                <p><strong>Status:</strong> ${itens[0].status || "Pedido logo sairá para a entrega"}</p>
                <p><strong>Forma de Pagamento:</strong> ${itens[0].forma_pagamento}</p>
                <div class="itens-pedido">
                    ${itens.map(item => `
                        <div class="item-pedido" style="border:1px solid #ccc; padding:10px; margin:10px 0;">
                            <img src="${item.foto}" alt="${item.nome}" width="70" style="border-radius:4px;">
                            <p><strong>${item.nome}</strong> (${item.cor}, ${item.tamanho})</p>
                            <p>Quantidade: ${item.quantidade}</p>
                            <p>Preço: R$ ${Number(item.preco_total).toFixed(2)}</p>
                            <button onclick="removerItem(${item.id})">Remover item</button>
                        </div>
                    `).join('')}
                </div>
                <p><strong>Total do Pedido:</strong> R$ ${total.toFixed(2)}</p>
                <button onclick="cancelarPedido('${pedidoId}')">Cancelar Pedido</button>
                <hr>
            `;

            pedidosLista.appendChild(div);
        }
    }

    // Função para remover item individual
    window.removerItem = function (id) {
        if (!confirm("Deseja remover este item do pedido?")) return;

        fetch(`http://localhost:3000/pedidos/item/${id}`, {
            method: "DELETE"
        })
            .then(res => res.json())
            .then(data => {
                alert(data.mensagem);
                carregarPedidos();
            })
            .catch(err => {
                console.error("Erro ao remover item:", err);
            });
    }

    // Função para cancelar todo o pedido
    window.cancelarPedido = function (pedidoId) {
        if (!confirm("Deseja cancelar todo o pedido?")) return;

        fetch(`http://localhost:3000/pedidos/${pedidoId}`, {
            method: "DELETE"
        })
            .then(res => res.json())
            .then(data => {
                alert(data.mensagem);
                carregarPedidos();
            })
            .catch(err => {
                console.error("Erro ao cancelar pedido:", err);
            });
    }

    carregarPedidos();
});
