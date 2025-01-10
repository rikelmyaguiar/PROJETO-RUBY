document.addEventListener('DOMContentLoaded', function () {
    // Função que cria e renderiza os cards para a seção escolhida
    async function carregarProdutos(categoria) {
        try {
            const response = await fetch(`http://localhost:3000/produtos/${categoria}`);
            if (!response.ok) {
                throw new Error('Erro ao carregar produtos');
            }

            const produtos = await response.json();
            const container = document.getElementById('cards-container');
            container.innerHTML = ''; // Limpar o container de cards antes de adicionar novos

            produtos.forEach(produto => {
                const card = document.createElement('div');
                card.classList.add('card');

                const img = document.createElement('img');
                img.src = 'imagens/produtos/joia/joia.png'; // Substitua por imagens reais
                img.alt = produto.nome;

                const nome = document.createElement('h3');
                nome.textContent = produto.nome;

                const preco = document.createElement('p');
                preco.innerHTML = `R$ <span>${produto.preco}</span>`;

                const button = document.createElement('button');
                button.textContent = 'ADICIONAR';

                card.appendChild(img);
                card.appendChild(nome);
                card.appendChild(preco);
                card.appendChild(button);

                container.appendChild(card);
            });
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
    }

    // Adicionar evento de clique nos links do menu
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // Previne o comportamento padrão de navegação
            const categoria = link.dataset.secao;
            carregarProdutos(categoria); // Carregar produtos da categoria selecionada
        });
    });

    // Carregar os produtos de "brincos" inicialmente
    carregarProdutos('brincos');
});
