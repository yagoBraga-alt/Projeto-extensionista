document.addEventListener('DOMContentLoaded', function() {
  const imagensInsumos = {
    "Farinha": "../img/farinha.png",
    "Ovo": "../img/ovo.png",
    "Leite": "../img/garrafa-de-leite.png",
    "Fermento": "../img/fermento.png",
    "Baunilha": "../img/baunilha.png",
    "Açúcar": "../img/acucar.png",
    "Manteiga": "../img/manteiga.png",
    "Chocolate": "../img/chocolate.png"
  };

  const params = new URLSearchParams(window.location.search); 
  const nome = params.get('nome');

  const title = document.getElementById('insumo-title');
  const destaque = document.getElementById('insumo-destaque');
  const camposNovo = document.getElementById('campos-novo-insumo');
  const excluirBtn = document.getElementById('excluirBtn');
  const salvarBtn = document.getElementById('salvarBtn') || document.querySelector('button[type="submit"]');

  const unidadeInput = document.getElementById('unidade');
  const quantidadeInput = document.getElementById('quantidade');
  const validadeInput = document.getElementById('validade');

  const limparBtn = document.getElementById('limparHistoricoBtn');
    if (limparBtn) {
    limparBtn.addEventListener('click', function() {
        if (confirm('Deseja realmente limpar o histórico deste insumo?')) {
        const key = `historico_${nome}`;
        localStorage.removeItem(key);
        mostrarHistorico(nome);
        alert('Histórico limpo com sucesso!');
        }
    });
    }


  function mostrarHistorico(nomeInsumo) {
    const key = `historico_${nomeInsumo}`;
    const entradas = JSON.parse(localStorage.getItem(key)) || [];
    const img = imagensInsumos[nomeInsumo] || '';

    const somaTotal = entradas.reduce((acc, val) => acc + (val.quantidade || 0), 0);

    document.getElementById('info-atual-insumo').innerHTML = `
      <img src="${img}" alt="${nomeInsumo}" />
      <span class="nome">${nomeInsumo}</span>
      <span class="soma">
        Total acumulado: <strong>${somaTotal}</strong>
        ${(entradas.length > 0) ? entradas[0].unidade : ''}
      </span>
    `;

    const ul = document.getElementById('historico-lista');
    ul.innerHTML = entradas.map(e =>
    `<li>${e.quantidade} ${e.unidade}
      - salvo em: ${e.dataRegistro || 'N/A'}</li>`
    ).join('');

  }

  function salvarInsumo() {
    if (!nome || !imagensInsumos[nome]) {
      alert('Erro: Insumo fixo inválido.');
      return;
    }

    const quantidade = Number(quantidadeInput.value);
    const unidade = unidadeInput.value.trim();
    const validade = validadeInput.value;

    if (!quantidade || quantidade < 0 || unidade === '' || !validade) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    // Data e hora atual no formato legível
    const dataRegistro = new Date().toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    const key = `historico_${nome}`;
    const entradas = JSON.parse(localStorage.getItem(key)) || [];

    entradas.push({ quantidade, unidade, validade, dataRegistro });
    localStorage.setItem(key, JSON.stringify(entradas));

    mostrarHistorico(nome);
    alert('Informações do insumo fixo atualizadas com sucesso!');
  }

  if (nome && imagensInsumos[nome]) {
    title.textContent = `Editar ${nome}`;
    destaque.innerHTML = `<img src="${imagensInsumos[nome]}" alt="${nome}"><span>${nome}</span>`;
    camposNovo.style.display = 'none';
    excluirBtn.style.display = 'none';

    const key = `historico_${nome}`;
    const entradas = JSON.parse(localStorage.getItem(key)) || [];

    if (entradas.length > 0) {
      const ultimo = entradas[entradas.length - 1];
      quantidadeInput.value = ultimo.quantidade;
      unidadeInput.value = ultimo.unidade;
      validadeInput.value = ultimo.validade;
    }
    mostrarHistorico(nome);
  } else {
    alert('Insumo fixo inválido ou não especificado.');
  }

  if (salvarBtn) {
    salvarBtn.addEventListener('click', function(e) {
      e.preventDefault();
      salvarInsumo();
    });
  }
});