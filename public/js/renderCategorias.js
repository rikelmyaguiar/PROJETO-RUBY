//Script para renderizar as categorias ao ser clicada no menu nav
document.addEventListener('DOMContentLoaded', () => {
    const menuLinks = document.querySelectorAll('.menu-link'); // Links do menu
    const containers = document.querySelectorAll('.conteiner-cards'); // Todos os contêineres de produtos
    const allTitles = document.querySelectorAll('.titulo'); // Títulos das categorias

    // Função para normalizar texto (remover acentos e transformar para minúsculas)
    function normalizarTexto(texto) {
        return texto
            .normalize('NFD') // Decompõe caracteres com diacríticos
            .replace(/[\u0300-\u036f]/g, '') // Remove os diacríticos
            .replace(/\s+/g, '') // Remove espaços
            .toLowerCase(); // Transforma em minúsculas
    }

    // Função para exibir apenas a categoria selecionada
    function mostrarCategoria(categoria) {
        // Oculta todos os contêineres e títulos
        containers.forEach(container => {
            container.style.display = 'none';
        });
        allTitles.forEach(title => {
            title.style.display = 'none';
        });

        if (categoria === 'home') {
            // Mostra todos os produtos e títulos
            containers.forEach(container => {
                container.style.display = 'flex';
            });
            allTitles.forEach(title => {
                title.style.display = 'block';
            });
        } else {
            // Exibe o contêiner e título da categoria clicada
            const categoriaContainer = document.getElementById(`cards-conteiner-${categoria}`);
            const categoriaTitle = Array.from(allTitles).find(title => 
                normalizarTexto(title.textContent) === categoria
            );

            if (categoriaContainer) {
                categoriaContainer.style.display = 'flex'; // Exibe o contêiner da categoria clicada
            } else {
                console.error(`Contêiner não encontrado para a categoria: ${categoria}`);
            }

            if (categoriaTitle) {
                categoriaTitle.style.display = 'block'; // Exibe o título da categoria clicada
            } else {
                console.error(`Título não encontrado para a categoria: ${categoria}`);
            }
        }
        
        window.scrollTo({ top: 0, behavior: 'auto' });
    }

    // Adiciona evento de clique nos links do menu
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const categoria = normalizarTexto(link.textContent.trim()); // Normaliza o nome da categoria
            mostrarCategoria(categoria); // Chama a função para exibir a categoria
        });
    });

    // Carregar todas as categorias ao iniciar
    carregarProdutos('ofertas');
    carregarProdutos('brincos');
    carregarProdutos('braceletes');
    carregarProdutos('pulseiras');
    carregarProdutos('colares');
    carregarProdutos('aneis');
    mostrarCategoria('home'); 
});