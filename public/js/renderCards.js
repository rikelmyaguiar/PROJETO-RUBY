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

          // Separa por vírgula e pega a primeira imagem
          const primeiraFoto = produto.foto?.split(',')[0]?.trim() || 'imagens/sem-foto.png';
          
          img.src = primeiraFoto;
          img.alt = produto.nome;
          img.classList.add('card-imagem');

          img.addEventListener('click', () => {
            abrirModalProduto(produto);
        });

          const nome = document.createElement('h3');
          nome.textContent = produto.nome;

          const preco = document.createElement('p');
          preco.innerHTML = `R$ <span>${produto.preco}</span>`;

          const estoque = document.createElement('p');
          if (produto.quantidade > 0) {
              estoque.textContent = 'Estoque disponível';
              estoque.style.color = 'green';
          } else {
              estoque.textContent = 'Esgotado';
              estoque.style.color = 'darkred';
          }

          const button = document.createElement('button');
          button.textContent = 'ADICIONAR';
          button.disabled = produto.quantidade === 0;

          button.addEventListener('click', (e) => {
              e.stopPropagation();
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

// Função para abrir o modal de produto
function abrirModalProduto(produto) {
  const modal = document.getElementById('modal-produto');
  const imagemPrincipal = document.getElementById('modal-imagem-principal');
  const miniaturasContainer = document.getElementById('miniaturas');
  const nomeEl = document.getElementById('modal-nome');
  const precoEl = document.getElementById('modal-preco');
  const corSelect = document.getElementById('modal-cor');
  const tamanhoSelect = document.getElementById('modal-tamanho');
  const quantidadeInput = document.getElementById('modal-quantidade');
  const totalEl = document.getElementById('modal-total');

  // Mostra o modal
  modal.classList.remove('hidden');

  // Nome e preço
  nomeEl.textContent = produto.nome;
  precoEl.textContent = `R$ ${produto.preco}`;
  quantidadeInput.value = 1;

  // Calcular total
  totalEl.textContent = `Total: R$ ${produto.preco}`;

  quantidadeInput.oninput = () => {
    const qtd = parseInt(quantidadeInput.value) || 1;
    const total = (qtd * parseFloat(produto.preco)).toFixed(2);
    totalEl.textContent = `Total: R$ ${total}`;
  };

  // Cores
  corSelect.innerHTML = '';
  const cor = produto.cor?.split(',') || [];
  cor.forEach(cor => {
    const option = document.createElement('option');
    option.value = cor.trim();
    option.textContent = cor.trim();
    corSelect.appendChild(option);
  });

  // Tamanhos
  tamanhoSelect.innerHTML = '';
  const tamanho = produto.tamanho?.split(',') || [];
  tamanho.forEach(t => {
    const option = document.createElement('option');
    option.value = t.trim();
    option.textContent = t.trim();
    tamanhoSelect.appendChild(option);
  });

  // Fotos
  miniaturasContainer.innerHTML = '';
  const fotos = produto.foto?.split(',') || [];
  const primeiraFoto = fotos[0]?.trim() || 'imagens/sem-foto.png';
  imagemPrincipal.src = primeiraFoto;

  fotos.forEach((foto, i) => {
    const mini = document.createElement('img');
    mini.src = foto.trim();
    mini.classList.add('miniatura');
    mini.onclick = () => {
      imagemPrincipal.src = foto.trim();
    };
    miniaturasContainer.appendChild(mini);
  });

  // Adicionar ao carrinho no LocalStorage
  const btnAdicionar = document.getElementById('btn-adicionar-sacola');
  btnAdicionar.onclick = () => {
    const quantidade = parseInt(quantidadeInput.value);
    const corSelecionada = corSelect.value;
    const tamanhoSelecionado = tamanhoSelect.value;

    const produtoCarrinho = {
      id: produto.id,
      nome: produto.nome,
      cor: corSelecionada,
      tamanho: tamanhoSelecionado,
      quantidade: quantidade,
      preco: produto.preco,
      total: (quantidade * produto.preco).toFixed(2),
    };

    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push(produtoCarrinho);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    fecharModalProduto();
  };
}

// Função para fechar o modal de produto
// === FECHA O MODAL ===
function fecharModalProduto() {
  document.getElementById('modal-produto').classList.add('hidden');
}

// === BOTÕES DE FECHAR ===
document.getElementById('btn-cancelar-modal').onclick = fecharModalProduto;
document.getElementById('btn-fechar-modal').onclick = fecharModalProduto;

