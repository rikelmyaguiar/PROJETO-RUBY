// Função para carregar produtos dinamicamente
async function carregarProdutos() {
  try {
    const response = await fetch("/produtos");
    const produtos = await response.json(); // Obtém os produtos do servidor

    const container = document.getElementById("cards-conteiner");
    container.innerHTML = ""; // Limpa o conteúdo antigo

    produtos.forEach((produto) => {
      // Cria um card para cada produto
      const card = document.createElement("div");
      card.classList.add("card");

      // Adiciona a imagem do produto
      const imagem = document.createElement("img");
      imagem.src = produto.foto; // Supondo que o campo da imagem se chama imagem_url
      imagem.alt = produto.nome;
      card.appendChild(imagem);

      // Adiciona o nome do produto
      const nome = document.createElement("h3");
      nome.textContent = produto.nome;
      card.appendChild(nome);

      // Adiciona o preço do produto
      const preco = document.createElement("p");
      preco.innerHTML = `R$<span>${produto.preco}</span>`; // Supondo que o campo do preço se chama preco
      card.appendChild(preco);

      // Adiciona o botão de adicionar ao carrinho
      const botao = document.createElement("button");
      botao.textContent = "ADICIONAR";
      card.appendChild(botao);

      // Adiciona o card ao container
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar os produtos:", error);
  }
}

// Carrega os produtos assim que a página for carregada
window.onload = carregarProdutos;
