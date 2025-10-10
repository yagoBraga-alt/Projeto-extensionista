document.addEventListener('DOMContentLoaded', function() {
  const imagensInsumos = {
    "Farinha": "../../static/img/farinha.png",
    "Ovo": "../../static/img/ovo.png",
    "Leite": "../../static/img/garrafa-de-leite.png",
    "Fermento": "../../static/img/fermento.png",
    "Baunilha": "../../static/img/baunilha.png",
    "Açúcar": "../../static/img/acucar.png",
    "Manteiga": "../../static/img/manteiga.png",
    "Chocolate": "../../static/img/chocolate.png"
  };

  const params = new URLSearchParams(window.location.search);
  const nome = params.get('nome');
  document.getElementById('nome').value = nome;

  const title = document.getElementById('insumo-title');
  const destaque = document.getElementById('insumo-destaque');
  const camposNovo = document.getElementById('campos-novo-insumo');
  const excluirBtn = document.getElementById('excluirBtn');
  const salvarBtn = document.getElementById('salvarBtn') || document.querySelector('button[type="submit"]');

  const descricaoInput = document.getElementById('descricao');
  const quantidadeInput = document.getElementById('quantidade');
  const validadeInput = document.getElementById('validade');
  const unidadeMedidaInput = document.getElementById('unidadeMedida');
  const fornecedorInput = document.getElementById('fornecedor');
  const precoCustoInput = document.getElementById('precoCusto');
  const idNotaInput = document.getElementById('idNota');
  const dataNotaInput = document.getElementById('dataNota');
  const valorTotalNotaInput = document.getElementById('valorTotalNota');
  const observacoesInput = document.getElementById('observacoes');

  const limparBtn = document.getElementById('limparHistoricoBtn');

  // Botão temporário “Zerar Total Acumulado”
  const zerarBtn = document.createElement('button');
  zerarBtn.textContent = "Zerar Total Acumulado";
  zerarBtn.type = "button";
  zerarBtn.style.background = "#d9534f";
  zerarBtn.style.color = "#fff";
  zerarBtn.style.border = "none";
  zerarBtn.style.padding = "8px 12px";
  zerarBtn.style.borderRadius = "6px";
  zerarBtn.style.cursor = "pointer";
  zerarBtn.style.marginTop = "10px";

  if (limparBtn) {
    limparBtn.parentNode.insertBefore(zerarBtn, limparBtn.nextSibling);
  }

  // Limpar o histórico mantendo o total acumulado
  if (limparBtn) {
    limparBtn.addEventListener('click', function() {
      if (confirm('Deseja realmente limpar o histórico deste insumo?')) {
        const key = `historico_${nome}`;
        const entradas = JSON.parse(localStorage.getItem(key)) || [];
        const somaTotal = entradas.reduce((acc, val) => acc + (val.quantidade || 0), 0);
        const unidadeMedida = (entradas.length > 0) ? entradas[0].unidadeMedida || entradas[0].unidade || '' : '';

        const novoHistorico = [{
          acumulado: true,
          quantidade: somaTotal,
          unidadeMedida: unidadeMedida
        }];

        localStorage.setItem(key, JSON.stringify(novoHistorico));
        mostrarHistorico(nome);
        alert('Histórico limpo, total acumulado preservado!');
      }
    });
  }

  // Zerar todo o histórico e total acumulado (botão temporário)
  zerarBtn.addEventListener('click', function() {
    if (confirm('Deseja realmente zerar todo o histórico, apagando o total acumulado?')) {
      const key = `historico_${nome}`;
      localStorage.removeItem(key);
      mostrarHistorico(nome);
      alert('Histórico e total acumulado zerados!');
    }
  });

  function mostrarHistorico(nomeInsumo) {
    const key = `historico_${nomeInsumo}`;
    const entradas = JSON.parse(localStorage.getItem(key)) || [];
    const img = imagensInsumos[nomeInsumo] || '';

    // Caso registro especial acumulado
    if (entradas.length === 1 && entradas[0].acumulado) {
      document.getElementById('info-atual-insumo').innerHTML = `
        <img src="${img}" alt="${nomeInsumo}" />
        <span class="nome">${nomeInsumo}</span>
        <span class="soma">
          Total acumulado: <strong>${entradas[0].quantidade}</strong> ${entradas[0].unidadeMedida}
        </span>
      `;
      document.getElementById('historico-lista').innerHTML = '<li>Informações detalhadas do histórico limpas.</li>';
      return;
    }

    const somaTotal = entradas.reduce((acc, val) => acc + (val.quantidade || 0), 0);

    document.getElementById('info-atual-insumo').innerHTML = `
      <img src="${img}" alt="${nomeInsumo}" />
      <span class="nome">${nomeInsumo}</span>
      <span class="soma">
        Total acumulado: <strong>${somaTotal}</strong> ${(entradas.length > 0) ? entradas[0].unidadeMedida : ''}
      </span>
    `;

    if (entradas.length === 0) {
      document.getElementById('historico-lista').innerHTML = '<li>Sem histórico para este insumo.</li>';
      return;
    }

    const ul = document.getElementById('historico-lista');
    ul.innerHTML = entradas.map(e => `
      <li>
        <strong>Peso Líquido (g):</strong> ${e.quantidade} <br>
        <strong>Descrição:</strong> ${e.descricao} <br>
        <strong>Unidade de Medida:</strong> ${e.unidadeMedida} <br>
        <strong>Fornecedor:</strong> ${e.fornecedor} <br>
        <strong>Preço de Custo Unitário:</strong> R$ ${parseFloat(e.precoCusto).toFixed(2)} <br>
        <strong>Nota Fiscal:</strong> ID ${e.idNota} - Data ${e.dataNota} - Valor R$ ${parseFloat(e.valorTotalNota).toFixed(2)} <br>
        <strong>Observações:</strong> ${e.observacoes || 'Nenhuma'} <br>
        <strong>Salvo em:</strong> ${e.dataRegistro || 'N/A'} <br>
        <strong>Validade:</strong> ${e.validade || 'N/A'}
      </li>
    `).join('');
  }

  function salvarInsumo() {
    if (!nome || !imagensInsumos[nome]) {
      alert('Erro: Insumo fixo inválido.');
      return;
    }

    const quantidade = Number(quantidadeInput.value);
    const descricao = descricaoInput.value.trim();
    const validade = validadeInput.value;
    const unidadeMedida = unidadeMedidaInput.value.trim();
    const fornecedor = fornecedorInput.value.trim();
    const precoCusto = precoCustoInput.value;
    const idNota = idNotaInput.value.trim();
    const dataNota = dataNotaInput.value;
    const valorTotalNota = valorTotalNotaInput.value;
    const observacoes = observacoesInput.value.trim();

    if (!quantidade || quantidade < 0 || descricao === '' || !validade ||
        unidadeMedida === '' || fornecedor === '' || precoCusto === '' ||
        idNota === '' || !dataNota || valorTotalNota === '') {
      alert('Preencha todos os campos obrigatórios corretamente.');
      return;
    }

    const dataRegistro = new Date().toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    const key = `historico_${nome}`;
    const entradas = JSON.parse(localStorage.getItem(key)) || [];

    entradas.push({
      quantidade, descricao, validade,
      unidadeMedida, fornecedor, precoCusto,
      idNota, dataNota, valorTotalNota,
      observacoes, dataRegistro
    });

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
      let ultimo = entradas[entradas.length - 1];
      quantidadeInput.value = ultimo.quantidade || '';
      descricaoInput.value = ultimo.descricao || '';
      validadeInput.value = ultimo.validade || '';
      unidadeMedidaInput.value = ultimo.unidadeMedida || '';
      fornecedorInput.value = ultimo.fornecedor || '';
      precoCustoInput.value = ultimo.precoCusto || '';
      idNotaInput.value = ultimo.idNota || '';
      dataNotaInput.value = ultimo.dataNota || '';
      valorTotalNotaInput.value = ultimo.valorTotalNota || '';
      observacoesInput.value = ultimo.observacoes || '';
    } else {
      quantidadeInput.value = '';
      descricaoInput.value = '';
      validadeInput.value = '';
      unidadeMedidaInput.value = '';
      fornecedorInput.value = '';
      precoCustoInput.value = '';
      idNotaInput.value = '';
      dataNotaInput.value = '';
      valorTotalNotaInput.value = '';
      observacoesInput.value = '';
    }

    mostrarHistorico(nome);
  } else {
    alert('Insumo fixo inválido ou não especificado.');
  }

  salvarBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const confirmado = window.confirm('Deseja realmente salvar este insumo?');
    if (confirmado) {
      salvarInsumo();
    }
  });
});
