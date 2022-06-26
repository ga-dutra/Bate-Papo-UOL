let nome;
let mensagem;
let lista_mensagens = [];
function obtemNome() {
  if (!nome) {
    nome = {
      name: String(prompt("Qual o seu nome?")),
    };
  } else {
    nome = {
      name: String(prompt("Entre com um nome diferente:")),
    };
  }
}
obtemNome();
verificaNome();
function verificaNome() {
  const nomeTeste = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    nome
  );

  nomeTeste.then(nomeValido);
  nomeTeste.catch(nomeInvalido);
}

function nomeValido(entrou) {
  const IDInterval = setInterval(mantemConexao, 5000);
}

function nomeInvalido(naoEntrou) {
  alert("O nome digitado já está em uso!");
  const statusCode = naoEntrou.response.status;
  alert(statusCode);
  obtemNome();
  verificaNome();
}

function carregaMensagens() {
  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );
  promise.then(renderizaMensagens);
}
carregamento3Segundos();

function carregamento3Segundos(mensagem) {
  const IDInterval = setInterval(carregaMensagens, 3000);
}

let a = "";
let b = "";
let auxiliar = 0;
function renderizaMensagens(mensagens) {
  document.querySelector(".conteudo").innerHTML = "";
  lista_mensagens = [];

  // Alimenta array lista_msg

  for (i = 0; i < 100; i++) {
    if (mensagens.data[i].type === "status") {
      mensagem = `<li class="msg_status">
      <div>
      <span class="horario">(${mensagens.data[i].time})</span><span class="espaço">l</span><span class="usuario">${mensagens.data[i].from}</span><span class="espaço">l</span> entra na sala... </div></li>`;
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
      } else {
        i--;
      }
    }
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

function mantemConexao() {
  const promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",
    nome
  );
}

function enviaMensagem() {
  if (document.querySelector(".mensagem").value !== "") {
    const envio = {
      from: nome.name,
      to: "Todos",
      text: document.querySelector(".mensagem").value,
      type: "message",
    };

    const promise = axios.post(
      "https://mock-api.driven.com.br/api/v6/uol/messages",
      envio
    );
    promise.then(carregaMensagens);
    promise.catch(recarregaPagina);
  } else {
    alert("Você não pode enviar uma mensagem vazia!");
  }
}

function recarregaPagina() {
  window.location.reload();
}

document.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    enviaMensagem();
  }
});
