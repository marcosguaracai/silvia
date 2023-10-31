let hoje = new Date();
let anoAtual = hoje.getFullYear();
let mesAtual = hoje.getMonth();
let diaAtual = hoje.getDate();

let eventos = {};

const nomesDosMeses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function formatarChaveData(ano, mes, dia) {
  return `${ano}-${mes + 1}-${dia}`;
}

function carregarEventos() {
  try {
    const eventosSalvos = localStorage.getItem('eventos');
    if (eventosSalvos) {
      eventos = JSON.parse(eventosSalvos);
    }
  } catch (error) {
    console.error("Erro ao carregar eventos:", error);
  }
}

function salvarEventos() {
  localStorage.setItem('eventos', JSON.stringify(eventos));
}

function criarBotao(texto, handler) {
  let button = document.createElement('button');
  button.innerText = texto;
  button.onclick = handler;
  return button;
}

function adicionarEvento(chaveData, evento) {
  if (!eventos[chaveData]) {
    eventos[chaveData] = [];
  }
  eventos[chaveData].push(evento);
  salvarEventos();
  mostrarEventos(chaveData.split('-')[2]);
}

function editarEvento(chaveData, index) {
  let novoEvento = prompt("Editar seu evento", eventos[chaveData][index]);
  if (novoEvento !== null) {
    eventos[chaveData][index] = novoEvento;
    salvarEventos();
    mostrarEventos(chaveData.split('-')[2]);
  }
}

function excluirEvento(chaveData, index) {
  eventos[chaveData].splice(index, 1);
  if (eventos[chaveData].length === 0) {
    delete eventos[chaveData];
  }
  salvarEventos();
  mostrarEventos(chaveData.split('-')[2]);
}

function selecionarDia(dia) {
  let chaveData = formatarChaveData(anoAtual, mesAtual, dia);
  mostrarEventos(dia);
  let evento = prompt("Adicione um evento ou deixe em branco");
  if (evento) {
    adicionarEvento(chaveData, evento);
  }
}

function mostrarEventos(dia) {
  let chaveData = formatarChaveData(anoAtual, mesAtual, dia);
  const listaTarefas = document.getElementById('listaTarefas');
  listaTarefas.innerHTML = '';

  if (eventos[chaveData]) {
    eventos[chaveData].forEach((evento, index) => {
      let itemTarefa = document.createElement('li');
      itemTarefa.innerText = evento;
      itemTarefa.appendChild(criarBotao('Editar', () => editarEvento(chaveData, index)));
      itemTarefa.appendChild(criarBotao('Excluir', () => excluirEvento(chaveData, index)));
      listaTarefas.appendChild(itemTarefa);
    });
  } else {
    listaTarefas.innerHTML = '<li>Nenhum evento para esta data.</li>';
  }
}

function montarCalendario() {
  let calendario = document.getElementById('calendario');
  calendario.innerHTML = '';

  let nomeDoMes = document.getElementById('nome-do-mes');
  nomeDoMes.textContent = `${nomesDosMeses[mesAtual]} ${anoAtual}`;

  let primeiroDiaDoMes = new Date(anoAtual, mesAtual, 1).getDay();
  let numeroDeDiasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();

  let cabecalho = calendario.createTHead();
  cabecalho.innerHTML = '';
  let linhaCabecalho = cabecalho.insertRow();
  let diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  diasDaSemana.forEach(dia => {
    let celulaCabecalho = linhaCabecalho.insertCell();
    celulaCabecalho.innerText = dia;
  });

  let linha = calendario.insertRow();
  for (let i = 0; i < primeiroDiaDoMes; i++) {
    linha.insertCell();
  }

  for (let dia = 1; dia <= numeroDeDiasNoMes; dia++) {
    if (linha.cells.length === 7) {
      linha = calendario.insertRow();
    }
    let celulaDia = linha.insertCell();
    celulaDia.innerText = dia;
    let chaveData = formatarChaveData(anoAtual, mesAtual, dia);
    if (eventos[chaveData]) {
      celulaDia.classList.add('comEvento');
    }
    if (dia === diaAtual && mesAtual === hoje.getMonth() && anoAtual === hoje.getFullYear()) {
      celulaDia.classList.add('hoje');
    }
    celulaDia.onclick = () => selecionarDia(dia);
  }
}

function configurarNavegacao() {
  document.getElementById('btnRetroceder').addEventListener('click', function() {
    mesAtual--;
    if (mesAtual < 0) {
      mesAtual = 11;
      anoAtual--;
    }
    montarCalendario();
  });

  document.getElementById('btnAvancar').addEventListener('click', function() {
    mesAtual++;
    if (mesAtual > 11) {
      mesAtual = 0;
      anoAtual++;
    }
    montarCalendario();
  });
}

// Inicialização
carregarEventos();
montarCalendario();
configurarNavegacao();
