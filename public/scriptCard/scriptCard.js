fetch('/produtos')
.then(response => response.json())
.then(data => {
    const container = document.getElementById('cards-container');
    container.innerHTML = ''; // Limpa o container

    // Itera sobre os produtos e cria os cards
    data.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${produto.foto}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p>Cor: ${produto.cor}</p>
            <p style="font-weight: 600;">R$<span>${produto.preco}</span></p>
            <button>ADICIONAR</button>
        `;
        container.appendChild(card);
    });
})
.catch(err => console.error('Erro ao carregar os produtos:', err));