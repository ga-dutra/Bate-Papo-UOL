let nome;
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

function renderizaMensagens(mensagens) {
  console.log(mensagens.data);
  document.querySelector(".conteudo").innerHTML = "";
  for (i = 0; i < 100; i++) {
    if (mensagens.data[i].type === "status") {
      document.querySelector(".conteudo").innerHTML += `<li class="msg_status">
      <div>
      <span class="horario">(${mensagens.data[i].time})</span><span class="espaço">l</span><span class="usuario">${mensagens.data[i].from}</span><span class="espaço">l</span> entra na sala... </div></li>`;
      document.querySelector(".msg_status").scrollIntoView();
    }
    if (mensagens.data[i].type === "message") {
      document.querySelector(
        ".conteudo"
      ).innerHTML += `<li class="msg_comum"><div><span class="horario">(${mensagens.data[i].time})</span><span class="espaço">l</span><span class="usuario">${mensagens.data[i].from}</span><span class="espaço">l</span>para<span class="espaço">l</span><span class="usuario">${mensagens.data[i].to}</span><span>:</span><span class="espaço">l</span><span class="message">${mensagens.data[i].text}</span> </div></li>`;
      document.querySelector(".msg_comum").scrollIntoView();
    }
    if (mensagens.data[i].type === "private_message") {
      document.querySelector(
        ".conteudo"
      ).innerHTML += `<li class="msg_reservada"><span class="horario">(${mensagens.data[i].time})</span><span class="espaço">l</span><span class="usuario">${mensagens.data[i].from}</span><span class="espaço">l</span>reservadamente para<span class="espaço">l</span><span class="usuario">${mensagens.data[i].to}</span><span>:</span><span class="espaço">l</span><span class="message">${mensagens.data[i].text}</span> </li>`;
      document.querySelector(".msg_reservada").scrollIntoView();
    }
  }
}

function mantemConexao() {
  const promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",
    nome
  );
  console.log("está conectado");
}
