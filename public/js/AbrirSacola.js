//Script para apenas abrir a sacola
// Obtém os elementos
const modal = document.getElementById("Modal");
const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");

// Função para abrir o modal
openModalBtn.onclick = function() {
  modal.style.display = "block";
  setTimeout(function() {
    modal.style.right = "0"; // Mover o modal para dentro da tela
  }, 10);
}

// Função para fechar o modal ao clicar no "x"
closeModalBtn.onclick = function() {
  closeModal(); // Chama a função para fechar o modal
}

// Função para fechar o modal
function closeModal() {
  modal.style.right = "-500px"; // Mover o modal para fora da tela
  setTimeout(function() {
    modal.style.display = "none"; // Esconder o modal após a animação
  }, 500); // Tempo da animação
}
