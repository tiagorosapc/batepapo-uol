const urlAPI = 'https://mock-api.driven.com.br/api/v6/uol';

function toggleMenu(){
    
    const menu = document.querySelector('.menu');
    const divFundo = document.querySelector('.menu-fundo');

    menu.classList.toggle('escondido');
    divFundo.classList.toggle('fundo-escondido');
}


function renderizarParticipantes(resposta){
    console.log('RENDERIZANDO PARTICIPATES');
    
    console.log(resposta.data);

    const ulContatos = document.querySelector('.contatos');

    // criando o item todos
    ulContatos.innerHTML = `
        <li class="visibilidade-publico" >
            <ion-icon name="people"></ion-icon><span class="nome">Todos</span><ion-icon class="check" name="checkmark-outline">
            </ion-icon>
        </li>        
    `;

    let template;

    let usuario;

    for( let i = 0; i < resposta.data.length; i++){
        
        usuario = resposta.data[i];

        template = `
            <li class="visibilidade-publico">
                <ion-icon name="person-circle"></ion-icon><span class="nome">${usuario.name}</span><ion-icon class="check" name="checkmark-outline">
                </ion-icon>
            </li>
        `;

        ulContatos.innerHTML += template;
    }

}

function carregarParticipantes(){
    // promisse de busca de participantes - ESCOPO É LOCAL
    const promise = axios.get(`${urlAPI}/participants`);
    promise.then(renderizarParticipantes);
}

function erroLogin(error){
    console.log('DEU RUIM AO LOGAR!!!!');
}

function posicionaNaUltimaMensagem(){
  
    const ultimaMensagem = document.querySelector('.mensagens-container li:last-child');
    ultimaMensagem.scrollIntoView();
}

function renderizarMensagens(resposta){    
    
    console.log(resposta.data);

    const ulMensagens = document.querySelector('.mensagens-container');

    ulMensagens.innerHTML = '';

    let mens;
    let templateMensagem;

    for(let i = 0; i < resposta.data.length; i++){
        
        mens = resposta.data[i];
        
        if (mens.type === 'private_message'){
            // MENSAGEM PRIVADA
            templateMensagem = `
                <li class="conversa-privada">
                <span class="horario">(${mens.time})</span>
                    <strong>${mens.from}</strong>
                        <span> reservadamente para </span>
                    <strong>${mens.to}: </strong>
                <span>${mens.text}</span>
                </li>
            `;
        }
        if (mens.type === 'message'){
            // MENSAGEM PUBLICA
            templateMensagem = `
            <li class="conversa-publica">
                <span class="horario">(${mens.time})</span>
                    <strong>${mens.from}</strong>
                        <span> para </span>
                    <strong>${mens.to}: </strong>
                <span>${mens.text}</span>
            </li>
            `;
        }
        if (mens.type === 'status'){
            // MENSAGEM STATUS
            templateMensagem = `
            <li class="entrada-saida">
                <span class="horario">(${mens.time})</span>
                    <strong>${mens.from}</strong>
                    <span> para </spa</strong>
                        <span> para </span>
                    <strong>${mens.to}: </strong>
                <span>E${mens.text}</span>
            </li>
            `;
        }

        ulMensagens.innerHTML += templateMensagem;
        
    }

    posicionaNaUltimaMensagem();
}

function carregarMensagens(resposta){
    console.log('BUSCANDO MENSAGENS');
    const promise = axios.get(`${urlAPI}/messages`);
    promise.then(renderizarMensagens);
}

function perguntarUsuario(){
    const nome = prompt('Qual é o seu nome?');
    // validações

    // ESCOPO LOCAL
    const promise = axios.post(`${urlAPI}/participants`, {name: nome});
    promise.then(carregarMensagens);
    promise.catch(erroLogin);
}

// ponto de entrada da aplicação
function entrarChat(){
    console.log('INICIANDO CHAT');

    carregarParticipantes();

    perguntarUsuario();

}
entrarChat();