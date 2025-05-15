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
  const alertPagamento = document.getElementById("AlertPagamento");
  const modalSucesso = document.getElementById("modal-pedido-enviado");
  const modalConfirmar = document.getElementById("modal-confirmar-pedido");
  const btnConfirmarPedido = document.getElementById("btn-confirmar-pedido");
  const btnCancelarPedido = document.getElementById("btn-cancelar-pedido");

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

  botaoFinalizar.addEventListener("click", () => {
    const pagamentoSel = document.querySelector("input[name='pagamento']:checked");
    if (!pagamentoSel) {
      alertPagamento.style.display = 'block';
      alertPagamento.classList.add('show');
      setTimeout(() => {
        alertPagamento.classList.remove('show');
        alertPagamento.style.display = 'none';
      }, 3000);
      return;
    }

    opcaoPagamento.style.display = "block";
    formCliente.style.display = "block";
    botaoFinalizar.style.display = "none";
    botaoEsvaziar.style.display = "none";
  });

  btnCancelarFormulario.addEventListener("click", () => {
    formCliente.style.display = "none";
    opcaoPagamento.style.display = "block";
    botaoFinalizar.style.display = "block";
    botaoEsvaziar.style.display = "block";
    renderizarSacola();
  });

  btnEnviar.addEventListener("click", () => {
    document.querySelectorAll(".erro-campo").forEach(e => e.remove());

    const camposObrigatorios = ["nome_cliente", "rua_avenida", "bairro", "numero", "telefone"];
    let valido = true;

    camposObrigatorios.forEach(id => {
      const campo = document.getElementById(id);
      if (!campo.value.trim()) {
        valido = false;
        const erro = document.createElement("span");
        erro.className = "erro-campo";
        erro.style.color = "red";
        erro.style.fontSize = "12px";
        erro.textContent = "Este campo é obrigatório.";
        campo.insertAdjacentElement("afterend", erro);
      }
    });

    const telefone = document.getElementById("telefone").value.trim();
    if (telefone && !/^[0-9]{10,11}$/.test(telefone)) {
      valido = false;
      const erro = document.createElement("span");
      erro.className = "erro-campo";
      erro.style.color = "red";
      erro.style.fontSize = "12px";
      erro.textContent = "Telefone inválido. Digite 10 ou 11 números.";
      document.getElementById("telefone").insertAdjacentElement("afterend", erro);
    }

    const cep = document.getElementById("CEP").value.trim();
    if (cep && !/^\d{8}$/.test(cep)) {
      valido = false;
      const erro = document.createElement("span");
      erro.className = "erro-campo";
      erro.style.color = "red";
      erro.style.fontSize = "12px";
      erro.textContent = "CEP inválido. Digite exatamente 8 números.";
      document.getElementById("CEP").insertAdjacentElement("afterend", erro);
    }

    const sacola = JSON.parse(localStorage.getItem("sacola")) || [];
    const pagamentoSel = document.querySelector("input[name='pagamento']:checked");
    if (!valido || !pagamentoSel || sacola.length === 0) return;

    modalConfirmar.style.display = "flex";
  });

  btnConfirmarPedido.onclick = async () => {
    const sacola = JSON.parse(localStorage.getItem("sacola")) || [];
    const pagamentoSel = document.querySelector("input[name='pagamento']:checked");
    const pedidoId = Math.floor(Math.random() * 900000 + 100000).toString();

    const dados = {
      nome_cliente: document.getElementById("nome_cliente").value.trim(),
      CEP: document.getElementById("CEP").value.trim(),
      rua_avenida: document.getElementById("rua_avenida").value.trim(),
      bairro: document.getElementById("bairro").value.trim(),
      numero: document.getElementById("numero").value.trim(),
      complemento: document.getElementById("complemento").value.trim(),
      telefone: document.getElementById("telefone").value.trim(),
      forma_pagamento: pagamentoSel.value
    };

    for (const prod of sacola) {
      const pedido = {
        pedidoId,
        ...prod,
        ...dados
      };

      const res = await fetch("/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido)
      });

      if (!res.ok) {
        alert("Erro ao enviar pedido.");
        return;
      }
    }

    for (const item of sacola) {
      try {
        const respostaEstoque = await fetch("http://localhost:3000/atualizar-estoque", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: item.id,
            categoria: item.categoria || "",
            quantidade: item.quantidade
          }),
        });

        const resultadoEstoque = await respostaEstoque.json();
        if (!respostaEstoque.ok || !resultadoEstoque.sucesso) {
          console.warn(`Erro ao atualizar estoque do produto ${item.id}`);
        }
      } catch (erro) {
        console.error(`Erro ao atualizar estoque do produto ${item.id}:`, erro);
      }
    }

    modalConfirmar.style.display = "none";
    modalSucesso.style.display = "flex";

    setTimeout(() => {
      modalSucesso.style.display = "none";
      fecharModal();
      formCliente.style.display = "none";
    }, 3000);

    localStorage.removeItem("sacola");
  };

  btnCancelarPedido.onclick = () => {
    modalConfirmar.style.display = "none";
  };

  const inputCEP = document.getElementById("CEP");
  inputCEP.addEventListener("blur", async function () {
    const cep = this.value.replace(/\D/g, "");
    document.querySelectorAll(".erro-campo").forEach(e => {
      if (e.previousElementSibling?.id === "CEP") e.remove();
    });

    if (cep.length !== 8) {
      const erro = document.createElement("span");
      erro.className = "erro-campo";
      erro.style.color = "red";
      erro.style.fontSize = "12px";
      erro.textContent = "CEP inválido. Digite exatamente 8 números.";
      inputCEP.insertAdjacentElement("afterend", erro);
      return;
    }

    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const dados = await resposta.json();

      if (dados.erro) {
        const erro = document.createElement("span");
        erro.className = "erro-campo";
        erro.style.color = "red";
        erro.style.fontSize = "12px";
        erro.textContent = "CEP não encontrado.";
        inputCEP.insertAdjacentElement("afterend", erro);
        return;
      }

      document.getElementById("rua_avenida").value = dados.logradouro || "";
      document.getElementById("bairro").value = dados.bairro || "";

    } catch (erro) {
      const erroSpan = document.createElement("span");
      erroSpan.className = "erro-campo";
      erroSpan.style.color = "red";
      erroSpan.style.fontSize = "12px";
      erroSpan.textContent = "Erro ao buscar o CEP.";
      inputCEP.insertAdjacentElement("afterend", erroSpan);
      console.error(erro);
    }
  });

  renderizarSacola();
});
