// Espera a página carregar antes de rodar o código
document.addEventListener('DOMContentLoaded', () => {

    // 1. PEGAR OS ELEMENTOS DO HTML
    const inputJogador = document.getElementById('jogador-input');
    const btnAdicionar = document.getElementById('add-btn');
    const listaJogadores = document.getElementById('lista-jogadores');
    const divMensagem = document.getElementById('mensagem');

    // 2. FUNÇÃO PRINCIPAL PARA ADICIONAR JOGADOR
    function adicionarJogador() {
        const nomeJogador = inputJogador.value.trim(); // Pega o texto e limpa espaços

        // REQUISITO 1: Mínimo de 5 caracteres
        if (nomeJogador.length < 5) {
            mostrarMensagem('Erro: O nome deve ter no mínimo 5 caracteres.', 'erro');
            // REQUISITO 2: Feedback visual de erro
            inputJogador.classList.add('erro-borda');
            inputJogador.classList.remove('sucesso-borda');
            return; // Para a função aqui
        }

        // Se passou na validação:
        // REQUISITO 2: Feedback visual de sucesso
        mostrarMensagem('Jogador adicionado com sucesso!', 'sucesso');
        inputJogador.classList.add('sucesso-borda');
        inputJogador.classList.remove('erro-borda');

        // Cria o novo item da lista
        criarItemLista(nomeJogador);

        // Limpa o campo de input
        inputJogador.value = '';
    }

    // 3. FUNÇÃO PARA CRIAR O ITEM (LI) NA LISTA
    function criarItemLista(nome) {
        const li = document.createElement('li');
        li.className = 'item-lista'; // Adiciona a classe do CSS
        
        // REQUISITO 5: Mudar ordem - torna o item "arrastável"
        li.setAttribute('draggable', 'true');

        // Coloca o conteúdo dentro do <li>
        li.innerHTML = `
            <span class="nome-jogador">${nome}</span>
            <div class="botoes">
                <button class="btn-acao btn-editar">✏️</button>
                <button class="btn-acao btn-excluir">❌</button>
            </div>
        `;

        // Adiciona o <li> pronto na lista <ul>
        listaJogadores.appendChild(li);
    }

    // 4. FUNÇÃO PARA MOSTRAR MENSAGENS (Req. 2)
    function mostrarMensagem(texto, tipo) {
        divMensagem.textContent = texto;
        // 'tipo' vai ser 'sucesso' ou 'erro' (que são classes do CSS)
        divMensagem.className = `mensagem ${tipo}`;

        // Limpa a mensagem depois de 3 segundos
        setTimeout(() => {
            divMensagem.textContent = '';
            divMensagem.className = 'mensagem';
        }, 3000);
    }

    // 5. FUNÇÃO PARA CUIDAR DOS CLIQUES (EDITAR E EXCLUIR - Req. 3 e 4)
    // Usamos "delegação de evento" para não ter que adicionar um listener para CADA botão
    function lidarCliquesLista(evento) {
        const itemClicado = evento.target; // Pega o que foi clicado (o ✏️ ou ❌)
        const itemPai = itemClicado.closest('.item-lista'); // Acha o <li> pai do botão

        if (!itemPai) return; // Se clicou fora dos botões, não faz nada

        // REQUISITO 3: Excluir item
        if (itemClicado.classList.contains('btn-excluir')) {
            itemPai.remove();
        }

        // REQUISITO 4: Editar item
        if (itemClicado.classList.contains('btn-editar')) {
            const nomeSpan = itemPai.querySelector('.nome-jogador');
            const estaEditando = nomeSpan.isContentEditable;

            if (estaEditando) {
                // Se JÁ ESTAVA editando, agora vamos SALVAR
                nomeSpan.contentEditable = false;
                itemClicado.textContent = '✏️'; // Volta o ícone para "editar"
                
                // Validação bônus: não deixar salvar com menos de 5 letras
                if (nomeSpan.textContent.trim().length < 5) {
                    mostrarMensagem('Erro: O nome editado também precisa de 5+ letras.', 'erro');
                    // (Aqui poderia voltar ao nome original, mas vamos deixar simples)
                }

            } else {
                // Se NÃO ESTAVA editando, vamos ATIVAR a edição
                nomeSpan.contentEditable = true;
                nomeSpan.focus(); // Coloca o cursor dentro do texto
                itemClicado.textContent = '💾'; // Troca o ícone para "salvar"
            }
        }
    }


    // 6. LÓGICA PARA REORDENAR (DRAG AND DROP - Req. 5)
    
    // Variável para guardar quem estamos arrastando
    let itemArrastado = null; 

    // Quando começa a arrastar
    listaJogadores.addEventListener('dragstart', (evento) => {
        itemArrastado = evento.target; // Guarda o <li> que está sendo arrastado
        itemArrastado.classList.add('arrastando'); // Adiciona classe CSS para dar opacidade
    });

    // Quando termina de arrastar (soltando o mouse)
    listaJogadores.addEventListener('dragend', () => {
        if (itemArrastado) {
            itemArrastado.classList.remove('arrastando');
        }
        itemArrastado = null;
    });

    // Onde o item está sendo arrastado "por cima"
    listaJogadores.addEventListener('dragover', (evento) => {
        evento.preventDefault(); // Necessário para permitir o "drop" (soltar)
        
        const itemAlvo = evento.target.closest('.item-lista'); // Pega o <li> que está "embaixo"
        
        if (itemAlvo && itemAlvo !== itemArrastado) {
            // Lógica para decidir se coloca ANTES ou DEPOIS
            const caixa = itemAlvo.getBoundingClientRect();
            const meioDoItem = caixa.top + (caixa.height / 2);

            if (evento.clientY < meioDoItem) {
                // Se o mouse está na metade de cima, insere ANTES
                listaJogadores.insertBefore(itemArrastado, itemAlvo);
            } else {
                // Se o mouse está na metade de baixo, insere DEPOIS
                listaJogadores.insertBefore(itemArrastado, itemAlvo.nextSibling);
            }
        }
    });


    // 7. OUVINTES DE EVENTOS (Os "gatilhos")
    
    // Gatilho para o clique no botão "Adicionar"
    btnAdicionar.addEventListener('click', adicionarJogador);

    // Gatilho para apertar "Enter" no input
    inputJogador.addEventListener('keydown', (evento) => {
        if (evento.key === 'Enter') {
            adicionarJogador();
        }
    });

    // Gatilho para cliques na lista (botões de editar/excluir)
    listaJogadores.addEventListener('click', lidarCliquesLista);
});