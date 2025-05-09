document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("Modal");
  const openModalBtn = document.getElementById("openModal");
  const closeModalBtn = document.getElementById("closeModal");
  const sacolaItens = document.getElementById("sacola-itens");
  const totalSacola = document.getElementById("total-sacola");
  const botaoFinalizar = document.querySelector(".botao-finalizar");
  const botaoEsvaziar = document.querySelector(".botao-esvaziar");
  const opcaoPagamento = document.getElementById("opcao-pagamento");
  const formCliente = document.getElementById("formulario-cliente");
  const btnEnviar = document.getElementById("btn-enviar-pedido");
  const btnCancelarFormulario = document.getElementById("btn-cancelar-formulario");

  function abrirModal() {
    modal.style.display = "block";
    setTimeout(() => modal.style.right = "0", 10);
    renderizarSacola();
  }

  function fecharModal() {
    modal.style.right = "-500px";
    setTimeout(() => modal.style.display = "none", 500);
  }

  openModalBtn.onclick = abrirModal;
  closeModalBtn.onclick = fecharModal;

  botaoEsvaziar.onclick = () => {
    localStorage.removeItem("sacola");
    renderizarSacola();
  };

  function formatarPreco(valor) {
    const numero = parseFloat(valor);
    if (isNaN(numero)) return 'R$ 0,00';
    return `R$ ${numero.toFixed(2).replace('.', ',')}`;
  }

  function renderizarSacola() {
    const sacola = JSON.parse(localStorage.getItem("sacola")) || [];
    sacolaItens.innerHTML = "";

    if (sacola.length === 0) {
      sacolaItens.innerHTML = "<p style='text-align:center;'>Sua sacola está vazia.</p>";
      totalSacola.textContent = "R$ 0,00";
      botaoFinalizar.style.display = "none";
      botaoEsvaziar.style.display = "none";
      opcaoPagamento.style.display = "none";
      formCliente.style.display = "none";
      return;
    }

    let total = 0;
    sacola.forEach((produto, index) => {
      const item = document.createElement("div");
      item.classList.add("sacola-item");
      const subtotal = produto.preco * produto.quantidade;
      total += subtotal;
      item.innerHTML = `
        <img src="${produto.foto}" alt="${produto.nome}">
        <div class="sacola-detalhes">
          <p><strong>${produto.nome}</strong></p>
          <p>Cor: ${produto.cor} | Tamanho: ${produto.tamanho}</p>
          <p>Preço: ${formatarPreco(produto.preco)}</p>
          <label>Qtd:
            <input type="number" class="quantidade-input" value="${produto.quantidade}" min="1" data-index="${index}">
          </label>
          <p>Subtotal: ${formatarPreco(subtotal)}</p>
          <button class="remover-produto" data-index="${index}">Remover</button>
        </div>
      `;
      sacolaItens.appendChild(item);
    });

    totalSacola.textContent = formatarPreco(total);
    adicionarListeners();

    botaoFinalizar.style.display = "block";
    botaoEsvaziar.style.display = "block";
    opcaoPagamento.style.display = "block";
    formCliente.style.display = "none";
  }

  function adicionarListeners() {
    document.querySelectorAll(".quantidade-input").forEach(input => {
      input.addEventListener("change", e => {
        const idx = e.target.dataset.index;
        const sacola = JSON.parse(localStorage.getItem("sacola")) || [];
        sacola[idx].quantidade = parseInt(e.target.value) || 1;
        localStorage.setItem("sacola", JSON.stringify(sacola));
        renderizarSacola();
      });
    });
    document.querySelectorAll(".remover-produto").forEach(btn => {
      btn.addEventListener("click", e => {
        const idx = e.target.dataset.index;
        const sacola = JSON.parse(localStorage.getItem("sacola")) || [];
        sacola.splice(idx, 1);
        localStorage.setItem("sacola", JSON.stringify(sacola));
        renderizarSacola();
      });
    });
  }

  // Exibe opções de pagamento e formulário
  botaoFinalizar.addEventListener("click", () => {
    opcaoPagamento.style.display = "block";
    formCliente.style.display = "block";
    botaoFinalizar.style.display = "none";
    botaoEsvaziar.style.display = "none";
  });

  // Cancelar finalização
  btnCancelarFormulario.addEventListener("click", () => {
    formCliente.style.display = "none";
    opcaoPagamento.style.display = "block";
    botaoFinalizar.style.display = "block";
    botaoEsvaziar.style.display = "block";
    renderizarSacola();
  });

  // Enviar pedido
  btnEnviar.addEventListener("click", async () => {
    const pagamentoSel = document.querySelector("input[name='pagamento']:checked");
    if (!pagamentoSel) return alert("Escolha forma de pagamento.");
    const pagamento = pagamentoSel.value;
    const sacola = JSON.parse(localStorage.getItem("sacola")) || [];
    const dados = {
      nome_cliente: document.getElementById("nome_cliente").value.trim(),
      CEP: document.getElementById("CEP").value.trim(),
      rua_avenida: document.getElementById("rua_avenida").value.trim(),
      bairro: document.getElementById("bairro").value.trim(),
      numero: document.getElementById("numero").value.trim(),
      complemento: document.getElementById("complemento").value.trim(),
      telefone: document.getElementById("telefone").value.trim(),
      forma_pagamento: pagamento
    };
    if (sacola.length === 0) return alert("Sacola vazia.");
    for (const prod of sacola) {
      const pedido = { ...prod, ...dados };
      const res = await fetch("/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido)
      });
      if (!res.ok) return alert("Erro ao enviar.");
    }
    alert("Pedido enviado!");
    localStorage.removeItem("sacola");
    fecharModal();
  });

    // Preencher rua e bairro com base no CEP
  const inputCEP = document.getElementById("CEP");

  inputCEP.addEventListener("blur", async function () {
    const cep = this.value.replace(/\D/g, "");

    if (cep.length !== 8) {
      alert("CEP inválido. Digite exatamente 8 números.");
      return;
    }

    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const dados = await resposta.json();

      if (dados.erro) {
        alert("CEP não encontrado.");
        return;
      }

      document.getElementById("rua_avenida").value = dados.logradouro || "";
      document.getElementById("bairro").value = dados.bairro || "";

    } catch (erro) {
      alert("Erro ao buscar o CEP.");
      console.error(erro);
    }
  });


  // Inicialização
  renderizarSacola();
});
