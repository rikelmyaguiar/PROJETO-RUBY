// Função para carregar os produtos de uma categoria
async function carregarProdutos(categoria) {
  try {
    const response = await fetch(`http://localhost:3000/produtos/${categoria}`);
    if (!response.ok) throw new Error("Erro ao carregar produtos");

    const produtos = await response.json();
    const container = document.getElementById(`cards-conteiner-${categoria}`);
    container.innerHTML = ""; // Limpa os produtos anteriores

    produtos.forEach((produto) => {
      produto.categoria = categoria; // Define a categoria no produto

      const card = document.createElement("div");
      card.classList.add("card");

      const img = document.createElement("img");
      const primeiraFoto =
        produto.foto?.split(",")[0]?.trim() || "imagens/sem-foto.png";
      img.src = primeiraFoto;
      img.alt = produto.nome;
      img.classList.add("card-imagem");

      // Adiciona o bloqueio de abrir o modal na foto caso o produto esteja esgotado
      img.addEventListener("click", () => {
        if (produto.quantidade > 0) {
          abrirModalProduto(produto);
        } else {
          console.log("Produto esgotado, não é possível abrir o modal.");
        }
      });

      const nome = document.createElement("h3");
      nome.textContent = produto.nome;

      const preco = document.createElement("span");
      preco.innerHTML = `R$ <span>${produto.preco}</span>`;

      const estoque = document.createElement("p");
      if (produto.quantidade > 0) {
        estoque.textContent = "Estoque disponível";
        estoque.style.color = "green";
      } else {
        estoque.textContent = "Esgotado";
        estoque.style.color = "darkred";
      }

      const button = document.createElement("button");
      button.textContent = "COMPRAR";
      button.disabled = produto.quantidade === 0;

      button.addEventListener("click", (e) => {
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
    console.error("Erro ao carregar produtos:", error);
  }
}

// Função para abrir o modal de produto
function abrirModalProduto(produto) {
  const modal = document.getElementById("modal-produto");
  const imagemPrincipal = document.getElementById("modal-imagem-principal");
  const miniaturasContainer = document.getElementById("miniaturas");
  const nomeEl = document.getElementById("modal-nome");
  const precoEl = document.getElementById("modal-preco");
  const corSelect = document.getElementById("modal-cor");
  const tamanhoSelect = document.getElementById("modal-tamanho");
  const quantidadeInput = document.getElementById("modal-quantidade");
  const totalEl = document.getElementById("modal-total");
  const btnAdicionar = document.getElementById("btn-adicionar-sacola");

  // Mostrar modal
  modal.classList.remove("hidden");

  // Preencher dados do produto
  nomeEl.textContent = produto.nome;
  precoEl.textContent = `R$ ${produto.preco}`;
  quantidadeInput.value = 1;
  totalEl.textContent = `Total: R$ ${produto.preco}`;

  // Resetar mensagem de erro ao abrir o modal
const erroQtd = document.getElementById("erro-qnt");
if (erroQtd) {
  erroQtd.style.display = "none";
  erroQtd.textContent = "";
}

  // Cores
  corSelect.innerHTML = "";
  const cores = produto.cor?.split(",") || [];
  cores.forEach((cor) => {
    const option = document.createElement("option");
    option.value = cor.trim();
    option.textContent = cor.trim();
    corSelect.appendChild(option);
  });

  // Tamanhos
  tamanhoSelect.innerHTML = "";
  const tamanhos = produto.tamanho?.split(",") || [];
  tamanhos.forEach((t) => {
    const option = document.createElement("option");
    option.value = t.trim();
    option.textContent = t.trim();
    tamanhoSelect.appendChild(option);
  });

  // Fotos
  miniaturasContainer.innerHTML = "";
  const fotos = produto.foto
    ? produto.foto.split(",").map((f) => f.trim())
    : ["imagens/sem-foto.png"];
  imagemPrincipal.src = fotos[0];

  fotos.forEach((foto) => {
    const mini = document.createElement("img");
    mini.src = foto;
    mini.classList.add("miniatura");
    mini.onclick = () => (imagemPrincipal.src = foto);
    miniaturasContainer.appendChild(mini);
  });

  // Mensagem de erro (se ainda não existir no DOM)
let mensagemErro = document.getElementById("erro-qnt");
if (!mensagemErro) {
  mensagemErro = document.createElement("div");
  mensagemErro.id = "erro-qnt";
  mensagemErro.classList.add("erro-campo");
  mensagemErro.style.display = "none";
  quantidadeInput.insertAdjacentElement("afterend", mensagemErro);
}

  // Atualiza total e valida quantidade
  quantidadeInput.oninput = () => {
    const qtd = parseInt(quantidadeInput.value) || 1;
    const total = (qtd * parseFloat(produto.preco)).toFixed(2);
    totalEl.textContent = `Total: R$ ${total}`;

    // Verifica se a quantidade é maior que o estoque
    if (qtd > produto.quantidade) {
      mensagemErro.textContent = "Quantidade ultrapassou o estoque disponível!";
      mensagemErro.style.display = "block";
    } else {
      mensagemErro.style.display = "none";
    }
  };

  // Clique no botão "Adicionar à Sacola"
  btnAdicionar.onclick = async () => {
    const quantidade = parseInt(quantidadeInput.value);
    const corSelecionada = corSelect.value;
    const tamanhoSelecionado = tamanhoSelect.value;

    if (quantidade > produto.quantidade) {
      mensagemErro.textContent = "Quantidade excede o estoque disponível!";
      mensagemErro.style.display = "block";
      return;
    }

    const produtoCarrinho = {
      id: produto.id,
      nome: produto.nome,
      cor: corSelecionada,
      tamanho: tamanhoSelecionado,
      quantidade,
      preco: produto.preco,
      total: (quantidade * produto.preco).toFixed(2),
      foto: fotos[0],
      categoria: produto.categoria
    };

    let sacola = JSON.parse(localStorage.getItem("sacola")) || [];
    sacola.push(produtoCarrinho);
    localStorage.setItem("sacola", JSON.stringify(sacola));

    atualizarContadorSacola();

    // Mostrar alerta de sucesso
    const alertElement = document.getElementById("customAlert");
    alertElement.style.display = "block";
    alertElement.classList.add("show");

    setTimeout(() => {
      alertElement.classList.remove("show");
      alertElement.style.display = "none";
    }, 3000);

    fecharModalProduto();
    carregarProdutos(produto.categoria);
  };
}


// Função para fechar o modal
function fecharModalProduto() {
  document.getElementById("modal-produto").classList.add("hidden");
}

// Botões de fechar modal
document.getElementById("btn-cancelar-modal").onclick = fecharModalProduto;
document.getElementById("btn-fechar-modal").onclick = fecharModalProduto;

// Função para atualizar o contador da sacola
function atualizarContadorSacola() {
  const sacola = JSON.parse(localStorage.getItem("sacola")) || [];
  const totalItens = sacola.reduce((soma, item) => soma + item.quantidade, 0);

  const contadorSacola = document.getElementById("contador-sacola");
  if (totalItens > 0) {
    contadorSacola.textContent = totalItens;
    contadorSacola.style.display = "inline-block";
  } else {
    contadorSacola.style.display = "none";
  }
}


// Atualiza o contador imediatamente ao carregar
atualizarContadorSacola();

// E continua atualizando a cada 500ms (meio segundo)
setInterval(atualizarContadorSacola, 500);

