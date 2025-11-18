document.addEventListener('DOMContentLoaded', () => {

    const inputElement = document.getElementById('item-input');
    const btnAdicionar = document.getElementById('add-btn');
    const listaItens = document.getElementById('lista-itens');
    const divMensagem = document.getElementById('mensagem');

    function adicionarItem() {
        const textoItem = inputElement.value.trim();

        if (textoItem.length < 5) {
            mostrarMensagem('Erro: O item deve ter no mínimo 5 caracteres.', 'erro');
            inputElement.classList.add('erro-borda');
            inputElement.classList.remove('sucesso-borda');
            return;
        }

        mostrarMensagem('Item adicionado com sucesso!', 'sucesso');
        inputElement.classList.add('sucesso-borda');
        inputElement.classList.remove('erro-borda');

        criarItemLista(textoItem);
        inputElement.value = '';
    }

    function criarItemLista(texto) {
        const li = document.createElement('li');
        li.className = 'item-lista';
        li.setAttribute('draggable', 'true');

        li.innerHTML = `
            <span class="texto-item">${texto}</span>
            <div class="botoes">
                <button class="btn-acao btn-editar">✏️</button>
                <button class="btn-acao btn-excluir">❌</button>
            </div>
        `;

        listaItens.appendChild(li);
    }

    function mostrarMensagem(texto, tipo) {
        divMensagem.textContent = texto;
        divMensagem.className = `mensagem ${tipo}`;

        setTimeout(() => {
            divMensagem.textContent = '';
            divMensagem.className = 'mensagem';
        }, 3000);
    }

    function lidarCliquesLista(evento) {
        const itemClicado = evento.target;
        const itemPai = itemClicado.closest('.item-lista');

        if (!itemPai) return;

        if (itemClicado.classList.contains('btn-excluir')) {
            itemPai.remove();
        }

        if (itemClicado.classList.contains('btn-editar')) {
            const spanItem = itemPai.querySelector('.texto-item');
            const estaEditando = spanItem.isContentEditable;

            if (estaEditando) {
                spanItem.contentEditable = false;
                itemClicado.textContent = '✏️';

                if (spanItem.textContent.trim().length < 5) {
                    mostrarMensagem('Erro: O item editado também precisa de 5+ letras.', 'erro');
                }

            } else {
                spanItem.contentEditable = true;
                spanItem.focus();
                itemClicado.textContent = '💾';
            }
        }
    }


    let itemArrastado = null;

    listaItens.addEventListener('dragstart', (evento) => {
        itemArrastado = evento.target;
        itemArrastado.classList.add('arrastando');
    });

    listaItens.addEventListener('dragend', () => {
        if (itemArrastado) {
            itemArrastado.classList.remove('arrastando');
        }
        itemArrastado = null;
    });

    listaItens.addEventListener('dragover', (evento) => {
        evento.preventDefault();
        
        const itemAlvo = evento.target.closest('.item-lista');
        
        if (itemAlvo && itemAlvo !== itemArrastado) {
            const caixa = itemAlvo.getBoundingClientRect();
            const meioDoItem = caixa.top + (caixa.height / 2);

            if (evento.clientY < meioDoItem) {
                listaItens.insertBefore(itemArrastado, itemAlvo);
            } else {
                listaItens.insertBefore(itemArrastado, itemAlvo.nextSibling);
            }
        }
    });


    btnAdicionar.addEventListener('click', adicionarItem);

    inputElement.addEventListener('keydown', (evento) => {
        if (evento.key === 'Enter') {
            adicionarItem();
        }
    });

    listaItens.addEventListener('click', lidarCliquesLista);
});
