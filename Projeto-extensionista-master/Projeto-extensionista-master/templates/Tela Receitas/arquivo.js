const recipes = {
  baunilha: `3 xícaras de trigo
1 xícara e meia de açúcar
3 ovos
3 colheres de manteiga
1 colher de sobremesa de baunilha
1 colher de sobremesa de fermento
1 pitada de sal`,
  chocolate: `2 xícaras de trigo
1 xícara de chocolate meio amargo
1 xícara e meia de açúcar
3 ovos
3 colheres de manteiga
1 colher de sobremesa de fermento
1 pitada de sal`,
  queijo: `2 xícaras de trigo
1 xícara de queijo ralado
3 ovos
3 colheres de manteiga
1 colher de sobremesa de fermento
1 pitada de sal`
};

window.addEventListener("DOMContentLoaded", () => {

  // ----- MODAL DE VISUALIZAR RECEITAS FIXAS -----
  const recipeModal = document.getElementById("recipeModal");
  const modalText = document.getElementById("modal-text");
  const closeRecipeBtn = document.getElementById("modalClose");

  const openModal = (content) => {
    modalText.textContent = content;
    recipeModal.style.display = "block";
  };

  closeRecipeBtn.addEventListener("click", () => {
    recipeModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === recipeModal) {
      recipeModal.style.display = "none";
    }
  });

  document.getElementById("baunilhaBtn").addEventListener("click", () => openModal(recipes.baunilha));
  document.getElementById("chocolateBtn").addEventListener("click", () => openModal(recipes.chocolate));
  document.getElementById("queijoBtn").addEventListener("click", () => openModal(recipes.queijo));

  // ----- MODAL DE CADASTRAR RECEITA -----
  const cadastrarModal = document.getElementById("cadastrarReceitaModal");
  const openCadastrarBtn = document.getElementById("cadastrarReceitaBtn");
  const closeCadastrarBtn = document.getElementById("closeCadastrar");
  const cancelarBtn = document.querySelector("#formReceita .cancelar-btn");
  const addLinhaBtn = document.getElementById("addReceitaLinhaBtn");
  const formReceita = document.getElementById("formReceita");
  const tbody = document.getElementById("receitaBody");
  const userRecipesDiv = document.getElementById("userRecipes");

  function criarReceitaLinha() {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="text" name="nomeIng[]" placeholder="Ingrediente" required></td>
      <td><input type="text" name="qtdIng[]" placeholder="Qtd" required></td>
      <td><input type="text" name="referenciaIng[]" placeholder="Referência" required></td>
      <td><input type="text" name="undMedRef[]" placeholder="Unid. Medida" required></td>
      <td><input type="text" name="pesoRef[]" placeholder="Peso" required></td>
      <td><button type="button" class="remover-linha-btn">&times;</button></td>
    `;
    row.querySelector(".remover-linha-btn").addEventListener("click", () => row.remove());
    return row;
  }

  function inicializarTabelaReceita(qtdLinhas = 3) {
    tbody.innerHTML = "";
    for (let i = 0; i < qtdLinhas; i++) {
      tbody.appendChild(criarReceitaLinha());
    }
  }

  // abrir modal cadastro
  openCadastrarBtn.addEventListener("click", () => {
    inicializarTabelaReceita();
    cadastrarModal.style.display = "block";
  });

  // fechar modal
  closeCadastrarBtn.addEventListener("click", () => (cadastrarModal.style.display = "none"));
  cancelarBtn.addEventListener("click", () => (cadastrarModal.style.display = "none"));

  // fechar ao clicar fora
  window.addEventListener("click", (event) => {
    if (event.target === cadastrarModal) cadastrarModal.style.display = "none";
  });

  // adicionar linha na tabela
  addLinhaBtn.addEventListener("click", () => tbody.appendChild(criarReceitaLinha()));

  // ----- SALVAR RECEITA PERSONALIZADA -----
  formReceita.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nomeReceita").value.trim();
    if (!nome) {
      alert("Por favor, insira o nome da receita.");
      return;
    }

    const ingredientes = [];
    tbody.querySelectorAll("tr").forEach((tr) => {
      ingredientes.push({
        nome: tr.querySelector('input[name="nomeIng[]"]').value,
        qtd: tr.querySelector('input[name="qtdIng[]"]').value,
        referencia: tr.querySelector('input[name="referenciaIng[]"]').value,
        undMedRef: tr.querySelector('input[name="undMedRef[]"]').value,
        pesoRef: tr.querySelector('input[name="pesoRef[]"]').value
      });
    });

    let receitaStr = `Nome: ${nome}\n\nIngredientes:\n`;
    ingredientes.forEach((ing) => {
      receitaStr += `- ${ing.qtd} ${ing.nome} (${ing.referencia}, ${ing.undMedRef}, ${ing.pesoRef})\n`;
    });

    // Cria o botão da nova receita
    const btn = document.createElement("button");
    btn.className = "user-recipe-btn";
    btn.textContent = nome;
    btn.addEventListener("click", () => openModal(receitaStr));

    // Adiciona o botão à lista
    userRecipesDiv.appendChild(btn);

    // Fecha modal e limpa o formulário
    cadastrarModal.style.display = "none";
    formReceita.reset();
  });
});
