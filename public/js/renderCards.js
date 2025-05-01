// Função para carregar os produtos de uma categoria
async function carregarProdutos(categoria) {
    try {
        const response = await fetch(`http://localhost:3000/produtos/${categoria}`);
        if (!response.ok) {
            throw new Error('Erro ao carregar produtos');
        }

        const produtos = await response.json();
        const container = document.getElementById(`cards-conteiner-${categoria}`);
        container.innerHTML = ''; // Limpa os produtos anteriores

        produtos.forEach(produto => {
            const card = document.createElement('div');
            card.classList.add('card');

            const img = document.createElement('img');
            img.src = produto.foto; // Carrega as fotos dos produtos nos cards
            img.alt = produto.nome;
            img.classList.add('card-imagem'); // Classe para facilitar a estilização

            const nome = document.createElement('h3');
            nome.textContent = produto.nome;

            const preco = document.createElement('p');
            preco.innerHTML = `R$ <span>${produto.preco}</span>`;

            // Adiciona a mensagem de estoque
            const estoque = document.createElement('p');
            if (produto.quantidade > 0) {
                estoque.textContent = 'Estoque disponível';
                estoque.style.color = 'green'; // Cor verde para estoque disponível
            } else {
                estoque.textContent = 'Esgotado';
                estoque.style.color = 'darkred'; // Cor vermelho escuro para esgotado
            }

            const button = document.createElement('button');
            button.textContent = 'ADICIONAR';
            button.disabled = produto.quantidade === 0; // Desativa o botão se o produto estiver esgotado

            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Evita que o clique no botão também dispare o evento de imagem
                abrirModalProduto(produto);
            });

            card.appendChild(img);
            card.appendChild(nome);
            card.appendChild(preco);
            card.appendChild(estoque);
            card.appendChild(button);

            container.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

// Carrega os produtos ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    carregarProdutos('ofertas');
    carregarProdutos('brincos');
    carregarProdutos('braceletes');
    carregarProdutos('pulseiras');
    carregarProdutos('colares');
    carregarProdutos('aneis');
});

// Função para abrir o modal com os dados do produto
function abrirModalProduto(produto) {
    const modal = document.getElementById('modal-produto');

    // Monta o conteúdo do modal
    const modalConteudo = modal.querySelector('.modal-conteudo');
    modalConteudo.innerHTML = `
        <div class="left">
            <img src="${produto.foto}" alt="${produto.nome}" class="main-photo" id="foto-principal">
        </div>
        <div class="right">
            <h2>${produto.nome}</h2>
            <p class="price" id="preco">R$ ${produto.preco.toFixed(2)}</p>

            <label for="cor">Cor</label>
            <select id="cor">
                ${produto.cores.map(cor => `<option value="${cor}">${cor}</option>`).join('')}
            </select>

            <label for="tamanho">Tamanho</label>
            <select id="tamanho">
                ${produto.tamanhos.map(t => `<option value="${t}">${t}</option>`).join('')}
            </select>

            <label>Quantidade</label>
            <div class="quantity">
                <button id="btn-diminuir">-</button>
                <span id="quantidade">1</span>
                <button id="btn-aumentar">+</button>
            </div>

            <button class="buy-btn" id="btn-adicionar">Adicionar ao Carrinho</button>
            <button class="buy-btn" style="margin-top: 10px; background-color: gray;" id="btn-cancelar">Cancelar</button>
        </div>
    `;

    // Exibe o modal
    modal.classList.remove('hidden');

    // Controle de quantidade
    let quantidadeAtual = 1;
    const spanQuantidade = modal.querySelector('#quantidade');
    const precoEl = modal.querySelector('#preco');

    modal.querySelector('#btn-aumentar').addEventListener('click', () => {
        if (quantidadeAtual < produto.quantidade) {
            quantidadeAtual++;
            spanQuantidade.textContent = quantidadeAtual;
            atualizarPreco();
        }
    });

    modal.querySelector('#btn-diminuir').addEventListener('click', () => {
        if (quantidadeAtual > 1) {
            quantidadeAtual--;
            spanQuantidade.textContent = quantidadeAtual;
            atualizarPreco();
        }
    });

    function atualizarPreco() {
        const total = produto.preco * quantidadeAtual;
        precoEl.textContent = `R$ ${total.toFixed(2)}`;
    }

    // Botão de adicionar ao carrinho
    modal.querySelector('#btn-adicionar').addEventListener('click', () => {
        const cor = modal.querySelector('#cor').value;
        const tamanho = modal.querySelector('#tamanho').value;

        const itemCarrinho = {
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: quantidadeAtual,
            cor: cor,
            tamanho: tamanho,
            foto: produto.foto
        };

        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        carrinho.push(itemCarrinho);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));

        alert('Produto adicionado à sacola!');
        fecharModalProduto();
    });

    // Botão de cancelar
    modal.querySelector('#btn-cancelar').addEventListener('click', fecharModalProduto);
}

// Função para fechar o modal
function fecharModalProduto() {
    const modal = document.getElementById('modal-produto');
    modal.classList.add('hidden');
}

