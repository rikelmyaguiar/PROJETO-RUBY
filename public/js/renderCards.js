// Função para carregar os produtos de uma categoria
async function carregarProdutos(categoria) {
    try {
        const response = await fetch(`http://localhost:3000/produtos/${categoria}`);
        if (!response.ok) {
            throw new Error('Erro ao carregar produtos');
        }

        const produtos = await response.json();
        const container = document.getElementById(`cards-conteiner-${categoria}`);
        container.innerHTML = '';

        produtos.forEach(produto => {
            const card = document.createElement('div');
            card.classList.add('card');

            const img = document.createElement('img');
            img.src = 'imagens/produtos/joia/joia.png'; // Usando uma imagem fixa
            img.alt = produto.nome;

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
    carregarProdutos('ofertas')
    carregarProdutos('brincos');
    carregarProdutos('braceletes');
    carregarProdutos('pulseiras');
    carregarProdutos('colares');
    carregarProdutos('aneis');
});
