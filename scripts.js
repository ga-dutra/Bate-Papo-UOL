let nome;
let mensagem;
let lista_mensagens = [];

function obtemNome() {
  if (document.querySelector(".nome_entrada").value === "") {
    alert("Por favor, insira um nome válido");
  } else if (!nome) {
    nome = {
      name: document.querySelector(".nome_entrada").value,
    };
    verificaNome();
  } else {
    verificaNome();
  }
}
let IDInterval;
function verificaNome() {
  const nomeTeste = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    nome
  );
  nomeTeste.then(nomeValido);
  nomeTeste.catch(nomeInvalido);
}

function nomeValido(entrou) {
  mudaTela1();
  chamaManterConexao();
}

function chamaManterConexao() {
  IDInterval = setInterval(mantemConexao, 5000);
}

function nomeInvalido(naoEntrou) {
  alert("O nome digitado já está em uso! Por favor, digite um nome diferente.");
  recarregaPagina();
}

function mudaTela1() {
  document.querySelector(".tela1").classList.add("escondido");
  document.querySelector(".tela2").classList.remove("escondido");
  setTimeout(mudaTela2, 3000);
}

function mudaTela2() {
  document.querySelector(".tela_inicial").classList.add("escondido");
  document.querySelector(".pagina").classList.remove("escondido");
  document.querySelector(".mensagem_container").classList.remove("escondido");
}

function mantemConexao() {
  const promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",
    nome
  );
}

function carregaMensagens() {
  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );
  promise.then(renderizaMensagens);
}
carregamento3Segundos();

function carregamento3Segundos(mensagem) {
  const IDInterval2 = setInterval(carregaMensagens, 3000);
}

let a = "";
let b = "";
let auxiliar = 0;

function renderizaMensagens(mensagens) {
  document.querySelector(".conteudo").innerHTML = "";
  lista_mensagens = [];

  // Alimenta array lista_msg
  let i = 0;
  while (lista_mensagens.length < 100) {
    if (!mensagens.data[i]) {
      break;
    }
    if (mensagens.data[i].type === "status") {
      mensagem = `<li class="msg_status">
      <div>
      <span class="horario">(${mensagens.data[i].time})</span><span class="espaço">l</span><span class="usuario">${mensagens.data[i].from}</span><span class="espaço">l</span><span class="message">${mensagens.data[i].text}</span></div></li>`;
      lista_mensagens.push(mensagem);
    }
    if (mensagens.data[i].type === "message") {
      mensagem = `<li class="msg_comum"><div><span class="horario">(${mensagens.data[i].time})</span><span class="espaço">l</span><span class="usuario">${mensagens.data[i].from}</span><span class="espaço">l</span>para<span class="espaço">l</span><span class="usuario">${mensagens.data[i].to}</span><span>:</span><span class="espaço">l</span><span class="message">${mensagens.data[i].text}</span> </div></li>`;
      lista_mensagens.push(mensagem);
    }
    if (mensagens.data[i].type === "private_message") {
      mensagem = `<li class="msg_reservada"><div><span class="horario">(${mensagens.data[i].time})</span><span class="espaço">l</span><span class="usuario">${mensagens.data[i].from}</span><span class="espaço">l</span>reservadamente para<span class="espaço">l</span><span class="usuario">${mensagens.data[i].to}</span><span>:</span><span class="espaço">l</span><span class="message">${mensagens.data[i].text}</span> </div></li>`;
      if (mensagens.data[i].to === nome.name) {
        lista_mensagens.push(mensagem);
      }
    }
    i++;
  }

  // Renderiza na tela as mensagens
  for (i = 0; i < lista_mensagens.length; i++) {
    document.querySelector(".conteudo").innerHTML += lista_mensagens[i];
  }
  document.querySelector(
    ".conteudo"
  ).innerHTML += `<div class="completa_margem"></div>`;
  scrollUltimaMsg();
}

function scrollUltimaMsg() {
  const ultima_msg = document.querySelector(".conteudo li:nth-last-child(2)");
  if (auxiliar === 0) {
    a = ultima_msg.innerHTML;
    auxiliar++;
  } else if (auxiliar === 1) {
    b = ultima_msg.innerHTML;
    auxiliar--;
  }
  if (a !== b) {
    ultima_msg.scrollIntoView();
  }
}

function enviaMensagem() {
  if (document.querySelector(".mensagem").value !== "") {
    const envio = {
      from: nome.name,
      to: contato,
      text: document.querySelector(".mensagem").value,
      type: tipo_msg,
    };

    const promise = axios.post(
      "https://mock-api.driven.com.br/api/v6/uol/messages",
      envio
    );
    promise.then(carregaMensagens);
    promise.catch(recarregaPagina);
    document.querySelector(".mensagem").value = "";
  } else {
    alert("Você não pode enviar uma mensagem vazia!");
  }
  if (contato === "Todos" && tipo_msg === "private_message") {
    alert("Não é possível enviar uma mensagem reservada para Todos!");
  }
}

function recarregaPagina() {
  window.location.reload();
}

document.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    if (
      String(document.querySelector(".pagina").classList) === "pagina escondido"
    ) {
      obtemNome();
    } else if (
      String(document.querySelector(".tela_inicial").classList) ===
      "tela_inicial escondido"
    ) {
      setTimeout(zeraTexto, 10);
      enviaMensagem();
    }
  }
});

function zeraTexto() {
  //Função de zerar o input após uma mensagem ser enviada
  document.querySelector(".mensagem").value = "";
}

obtemParticipantes();
const interval_participantes = setInterval(obtemParticipantes, 10 * 1000);
function obtemParticipantes() {
  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/participants"
  );
  promise.then(listaParticipantes);
  promise.catch();
}
let numero_participantes = 0;
function listaParticipantes(participantes) {
  numero_participantes = participantes.data.length;
  document.querySelector(
    ".lista_participantes"
  ).innerHTML = `<div onclick="check_contato(this)" class="sem_check">
  <ion-icon name="people"></ion-icon>
  <span>Todos</span>
  <ion-icon class="checkmark" name="checkmark"></ion-icon>
</div>`;
  for (i = 0; i < participantes.data.length; i++) {
    document.querySelector(
      ".lista_participantes"
    ).innerHTML += `<div onclick="check_contato(this)" class="sem_check">
    <ion-icon name="person-circle"></ion-icon> <span>${participantes.data[i].name}</span>
    <ion-icon class="checkmark" name="checkmark"></ion-icon>
  </div>`;
  }
}
let contato = "Todos";
function check_contato(element) {
  for (i = 1; i < numero_participantes + 1; i++) {
    document
      .querySelector(`.lista_participantes div:nth-child(${i + 1})`)
      .classList.add("sem_check");
  }
  contato = element.childNodes[3].innerHTML;
  document.querySelector(".contato_envio").innerHTML = contato;
  element.classList.toggle("sem_check");
}

let tipo_msg = "message";
function checkVisibilidade(element) {
  document.querySelector(".publico div").classList.add("sem_check");
  document.querySelector(".reservadamente div").classList.add("sem_check");
  element.classList.toggle("sem_check");
  if (
    String(document.querySelector(".reservadamente div").classList) ===
    "sem_check"
  ) {
    tipo_msg = "message";
    document.querySelector(".tipo_envio").innerHTML = "";
  } else if (
    String(document.querySelector(".publico div").classList) === "sem_check"
  ) {
    tipo_msg = "private_message";
    document.querySelector(".tipo_envio").innerHTML = "(Reservadamente)";
  }
  checkReservadamente();
}

function checkReservadamente() {
  //Não permite enviar uma mensagem Reservada para 'Todos'
  if (contato === "Todos") {
    document.querySelector(".tipo_envio").innerHTML = "";
  }
}

function abreSideBar() {
  document.querySelector("body").classList.add("sem_overflow");
  document.querySelector(".menu_envio").classList.add("com_overflow");
  document.querySelector(".menu_envio").classList.remove("escondido");
  document.querySelector(".pagina").classList.add("meia_opacidade");
  document.querySelector(".mensagem_container").classList.add("meia_opacidade");
}

function fechaSideBar() {
  document.querySelector("body").classList.remove("sem_overflow");
  document.querySelector(".menu_envio").classList.add("escondido");
  document.querySelector(".pagina").classList.remove("meia_opacidade");
  document
    .querySelector(".mensagem_container")
    .classList.remove("meia_opacidade");
}
