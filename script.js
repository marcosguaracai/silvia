let hoje = new Date();
let anoAtual = hoje.getFullYear();
let mesAtual = hoje.getMonth();
let diaAtual = hoje.getDate();

let eventos = {};

const nomesDosMeses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const feriadosAnuais = {
  '0': ['1'], // Janeiro: Ano Novo
  '1': ['13'], // Carnaval Fevereiro: 
  '2': [], // Março: (sem feriados fixos)
  '3': ['6', '21', '26', '30'], // Abril: Tiradentes
  '4': ['1'], // Maio: Dia do Trabalhador
  '5': [], // Junho: (sem feriados fixos)
  '6': ['9'], // Julho: Revolução Constitucionalista (feriado estadual em SP)
  '7': [], // Agosto: (sem feriados fixos)
  '8': ['7'], // Setembro: Independência do Brasil
  '9': ['12'], // Outubro: Nossa Senhora Aparecida
  '10': ['2', '15'], // Novembro: Finados e Proclamação da República
  '11': ['25'], // Dezembro: Natal
};

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
function adicionarFeriadosComoEventos() {
  for (const mes in feriadosAnuais) {
    feriadosAnuais[mes].forEach(dia => {
      const chaveData = formatarChaveData(anoAtual, parseInt(mes), parseInt(dia));
      if (!eventos[chaveData]) {
        eventos[chaveData] = ['Feriado'];
      }
    });
  }
  salvarEventos(); // Salva os feriados no localStorage após adicioná-los
}
function montarCalendario() {
  let calendario = document.getElementById('calendario');
  calendario.innerHTML = '';
  let nomeDoMes = document.getElementById('nome-do-mes');
  nomeDoMes.textContent = `${nomesDosMeses[mesAtual]} ${anoAtual}`;
  let primeiroDiaDoMes = new Date(anoAtual, mesAtual, 1).getDay();
  let numeroDeDiasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();

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
    if (feriadosAnuais[String(mesAtual)] && feriadosAnuais[String(mesAtual)].includes(String(dia))) {
      celulaDia.classList.add('feriado');
    }
    celulaDia.addEventListener('mouseover', () => mostrarEventos(dia));
    celulaDia.addEventListener('click', () => selecionarDia(dia));
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
window.addEventListener('load', function() {
  carregarEventos();
  montarCalendario();
  configurarNavegacao();
});