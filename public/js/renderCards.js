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
            img.src = 'imagens/produtos/joia/joia.png'; // Usando uma imagem fixa, pode ser ajustado dinamicamente
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
            button.addEventListener('click', () => abrirModalProduto(produto)); // Abre o modal ao clicar no botão

            // Eventos para abrir o modal ao clicar na imagem ou no botão
            img.addEventListener('click', () => abrirModalProduto(produto));
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

// Função para abrir o modal de um produto específico
// Função para abrir o modal de um produto específico
function abrirModalProduto(produto) {
    // Seleciona o modal
    const modal = document.getElementById('modal-produto');
    
    // Verifica se o campo 'foto' existe
    const fotoPrincipal = produto.foto || ''; // Se não existir, cria uma string vazia
    
    // Preenche o conteúdo do modal com os dados do produto
    const modalConteudo = modal.querySelector('.modal-conteudo');
    modalConteudo.innerHTML = `
      <div class="left">
        <img src="imagens/produtos/joia/${fotoPrincipal}" alt="${produto.nome}" class="main-photo" id="foto-principal">
        <!-- Removei o map, pois não existe mais o campo 'fotos' -->
      </div>
      <div class="right">
        <h2>${produto.nome}</h2>
        <p class="price" id="preco">R$ ${produto.preco}</p>
        <label for="color">Cor</label>
        <select id="color">
          ${produto.cores.map(cor => `<option value="${cor}">${cor}</option>`).join('')}
        </select>
        
        <label for="size">Tamanho</label>
        <select id="size">
          ${produto.tamanhos.map(tamanho => `<option value="${tamanho}">${tamanho}</option>`).join('')}
        </select>
        
        <label>Quantidade</label>
        <div class="quantity">
          <button onclick="alterarQuantidade(-1, ${produto.id})">-</button>
          <span id="quantidade">1</span>
          <button onclick="alterarQuantidade(1, ${produto.id})">+</button>
        </div>
        
        <button class="buy-btn" onclick="adicionarAoCarrinho(${produto.id}, '${produto.nome}', ${produto.preco})">Adicionar ao Carrinho</button>
      </div>
    `;
    
    // Exibe o modal
    modal.classList.remove('hidden');
  }  

// Função para trocar a foto principal
function trocarFoto(foto) {
    const fotoPrincipal = document.getElementById('foto-principal');
    fotoPrincipal.src = `imagens/produtos/joia/${foto}`;
}

// Função para alterar a quantidade no modal
function alterarQuantidade(delta, idProduto) {
    const quantidade = document.getElementById('quantidade');
    const produto = obterProdutoPorId(idProduto); // Função para obter produto do banco de dados ou de um array
    let novaQuantidade = parseInt(quantidade.textContent) + delta;
    
    // Verifica se a nova quantidade não excede o estoque
    if (novaQuantidade >= 1 && novaQuantidade <= produto.quantidade) {
        quantidade.textContent = novaQuantidade;
        atualizarPreco(produto.preco, novaQuantidade);
    }
}

// Função para atualizar o preço com base na quantidade
function atualizarPreco(precoUnitario, quantidade) {
    const precoTotal = precoUnitario * quantidade;
    document.getElementById('preco').textContent = `R$ ${precoTotal.toFixed(2)}`;
}

// Função para adicionar o produto ao carrinho (no LocalStorage)
function adicionarAoCarrinho(idProduto, nomeProduto, preco) {
    const quantidade = document.getElementById('quantidade').textContent;
    const produto = {
        id: idProduto,
        nome: nomeProduto,
        preco: preco,
        quantidade: quantidade,
    };

    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push(produto);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    alert('Produto adicionado ao carrinho!');
    fecharModalProduto();
}

// Função para fechar o modal
function fecharModalProduto() {
    const modal = document.getElementById('modal-produto');
    modal.classList.add('hidden');
}

// Função para obter o produto pelo ID (pode vir de um array ou banco de dados)
function obterProdutoPorId(idProduto) {
    // Aqui, você deve buscar o produto diretamente no banco de dados ou de uma API
    // Esse código de exemplo apenas simula um array de produtos, você deve substituí-lo
    const produtos = [
        { id: 1, nome: 'Brinco de Ouro', preco: 150, quantidade: 10, fotos: ['foto1.png', 'foto2.png'], cores: ['Dourado', 'Prata'], tamanhos: ['P', 'M', 'G'] },
        // Adicione outros produtos aqui
    ];

    return produtos.find(produto => produto.id === idProduto);
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
