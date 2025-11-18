document.addEventListener('DOMContentLoaded', () => {

    const inputTexto = document.getElementById('item-text-input');
    const inputImgUrl = document.getElementById('img-url-input');
    const btnAdicionar = document.getElementById('add-btn');
    const listaItens = document.getElementById('lista-itens');
    const divMensagem = document.getElementById('mensagem');

    function adicionarItem() {
        const textoItem = inputTexto.value.trim();
        const imgUrl = inputImgUrl.value.trim();

        if (textoItem.length < 5) {
            mostrarMensagem('Erro: O item deve ter no mínimo 5 caracteres.', 'erro');
            inputTexto.classList.add('erro-borda');
            inputTexto.classList.remove('sucesso-borda');
            return;
        }

        mostrarMensagem('Item adicionado com sucesso!', 'sucesso');
        inputTexto.classList.add('sucesso-borda');
        inputTexto.classList.remove('erro-borda');

        criarItemLista(textoItem, imgUrl);
        
        inputTexto.value = '';
        inputImgUrl.value = '';
    }

    function criarItemLista(texto, imgUrl) {
        const li = document.createElement('li');
        li.className = 'item-lista';

        // REQUISITO 6: Adiciona a tag de imagem (apenas se a URL foi fornecida)
        let imgTag = '';
        if (imgUrl) {
            // onerror esconde a imagem se o link estiver quebrado
            imgTag = `<img src="${imgUrl}" class="item-imagem" alt="" onerror="this.style.display='none'">`;
        }

        // HTML interno do item, agora com botões de subir/descer
        li.innerHTML = `
            <div class="item-conteudo">
                ${imgTag}
                <span class="texto-item">${texto}</span>
            </div>
            <div class="botoes-grupo">
                <button class="btn-acao btn-subir">⬆️</button>
                <button class="btn-acao btn-descer">⬇️</button>
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

        // REQUISITO 3: Excluir
        if (itemClicado.classList.contains('btn-excluir')) {
            itemPai.remove();
        }

        // REQUISITO 4: Editar
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

        // REQUISITO 5: Mover para Cima
        if (itemClicado.classList.contains('btn-subir')) {
            const itemAnterior = itemPai.previousElementSibling;
            if (itemAnterior) {
                listaItens.insertBefore(itemPai, itemAnterior);
            }
        }

        // REQUISITO 5: Mover para Baixo
        if (itemClicado.classList.contains('btn-descer')) {
            const itemSeguinte = itemPai.nextElementSibling;
            if (itemSeguinte) {
                listaItens.insertBefore(itemPai, itemSeguinte.nextSibling);
            }
        }
    }


    // --- OUVINTES DE EVENTOS ---
    
    btnAdicionar.addEventListener('click', adicionarItem);

    // Adiciona com "Enter" em qualquer um dos campos de input
    inputTexto.addEventListener('keydown', (evento) => {
        if (evento.key === 'Enter') {
            adicionarItem();
        }
    });

    inputImgUrl.addEventListener('keydown', (evento) => {
        if (evento.key === 'Enter') {
            adicionarItem();
        }
    });

    listaItens.addEventListener('click', lidarCliquesLista);
});
