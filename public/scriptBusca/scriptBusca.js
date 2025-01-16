document.addEventListener('DOMContentLoaded', () => {
    const buscaInput = document.getElementById('busca'); // Campo de busca
    const botaoLupa = document.getElementById('botao-lupa'); // Botão da lupa
    const containers = document.querySelectorAll('.conteiner-cards'); // Todos os contêineres de produtos
    const allTitles = document.querySelectorAll('.titulo'); // Títulos das categorias
    const mensagemErro = document.getElementById('mensagem-erro'); // Elemento de erro

    // Função para filtrar produtos com base na pesquisa
    function filtrarProdutos(pesquisa) {
        // Remover espaços extras e transformar a pesquisa em minúsculas
        const pesquisaNormalizada = pesquisa.trim().toLowerCase();
        let encontrouResultado = false;

        // Verificar se a pesquisa não está vazia
        if (pesquisaNormalizada.length > 0) {
            // Filtra os produtos e títulos
            containers.forEach(container => {
                const categoria = container.getAttribute('id').toLowerCase(); // Pegando a categoria de cada container
                if (categoria.includes(pesquisaNormalizada)) {
                    container.style.display = 'flex'; // Exibe o produto que contém a pesquisa
                    encontrouResultado = true; // Encontrou pelo menos um resultado
                } else {
                    container.style.display = 'none'; // Oculta o produto que não contém a pesquisa
                }
            });
            allTitles.forEach(title => {
                const titleText = title.textContent.toLowerCase(); // Obtém o texto do título
                if (titleText.includes(pesquisaNormalizada)) {
                    title.style.display = 'block'; // Exibe o título se encontrar correspondência
                    encontrouResultado = true; // Encontrou pelo menos um resultado
                } else {
                    title.style.display = 'none'; // Oculta o título caso não haja correspondência
                }
            });

            // Se não encontrou resultados, exibe a mensagem de erro
            if (encontrouResultado) {
                mensagemErro.style.display = 'none'; // Esconde a mensagem de erro
            } else {
                mensagemErro.style.display = 'block'; // Exibe a mensagem de erro
            }
        } else {
            // Se a pesquisa estiver vazia, exibe todos os produtos e títulos
            containers.forEach(container => {
                container.style.display = 'flex';
            });
            allTitles.forEach(title => {
                title.style.display = 'block';
            });

            // Esconde a mensagem de erro quando o campo de pesquisa está vazio
            mensagemErro.style.display = 'none';
        }
    }

    // Evento para quando o usuário digitar no campo de busca
    buscaInput.addEventListener('input', () => {
        const pesquisa = buscaInput.value;
        filtrarProdutos(pesquisa); // Chama a função de filtro
    });

    // Evento para clicar no botão da lupa (caso queira fazer a busca por clique também)
    botaoLupa.addEventListener('click', () => {
        const pesquisa = buscaInput.value;
        filtrarProdutos(pesquisa); // Chama a função de filtro
    });
});
