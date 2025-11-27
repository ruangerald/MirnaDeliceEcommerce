document.addEventListener('DOMContentLoaded', () => {
    const carrinhoLista = document.getElementById('carrinho-lista');
    const totalCarrinhoSpan = document.getElementById('total-carrinho');
    const finalizarCompraBtn = document.getElementById('finalizar-compra');
    const carrinhoVazioMsg = document.getElementById('carrinho-vazio-msg');

    // Funções auxiliares (carregarCarrinho, salvarCarrinho, calcularTotalCarrinho)
    // são assumidas como disponíveis globalmente pelo progIndex.js ou repetidas aqui.
    // Vamos repetir as necessárias para garantir a funcionalidade:
    function carregarCarrinho() {
        return JSON.parse(localStorage.getItem('mirnasDeliceCarrinho')) || [];
    }
    
    function salvarCarrinho(carrinho) {
        localStorage.setItem('mirnasDeliceCarrinho', JSON.stringify(carrinho));
    }
    
    function calcularTotalCarrinho(carrinho) {
        return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }
    
    // --- Renderização e Ações na Página Carrinho ---

    function renderizarCarrinho() {
        let carrinho = carregarCarrinho();
        carrinhoLista.innerHTML = '';
        
        if (carrinho.length === 0) {
            carrinhoVazioMsg.style.display = 'block';
            document.getElementById('carrinho-resumo').style.display = 'none';
            return;
        }

        carrinhoVazioMsg.style.display = 'none';
        document.getElementById('carrinho-resumo').style.display = 'block';

        carrinho.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('carrinho-item');
            itemDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px dashed #ccc;';
            
            const subtotal = (item.preco * item.quantidade).toFixed(2).replace('.', ',');

            itemDiv.innerHTML = `
                <div style="flex-grow: 1;">
                    <p style="font-weight: bold; margin-bottom: 5px;">${item.nome}</p>
                    <p>R$ ${item.preco.toFixed(2).replace('.', ',')} x 
                        <span id="qtd-${item.id}">${item.quantidade}</span> = 
                        <span style="color: var(--cor-laranja);">R$ ${subtotal}</span>
                    </p>
                </div>
                <div>
                    <button class="btn-quantidade" data-id="${item.id}" data-acao="remover" style="margin-right: 5px; padding: 5px 8px;">-</button>
                    <button class="btn-quantidade" data-id="${item.id}" data-acao="adicionar" style="margin-right: 15px; padding: 5px 8px;">+</button>
                    <button class="btn-remover" data-id="${item.id}" style="background-color: #f44336; color: white; border: none; padding: 8px 10px; border-radius: 5px; cursor: pointer;">Remover</button>
                </div>
            `;
            carrinhoLista.appendChild(itemDiv);
        });

        totalCarrinhoSpan.textContent = calcularTotalCarrinho(carrinho).toFixed(2).replace('.', ',');

        // Adicionar Listeners de Ação
        adicionarListenersAcao();
    }

    function adicionarListenersAcao() {
        document.querySelectorAll('.btn-quantidade').forEach(button => {
            button.addEventListener('click', (event) => {
                const idProduto = event.target.getAttribute('data-id');
                const acao = event.target.getAttribute('data-acao');
                atualizarQuantidade(idProduto, acao);
            });
        });

        document.querySelectorAll('.btn-remover').forEach(button => {
            button.addEventListener('click', (event) => {
                const idProduto = event.target.getAttribute('data-id');
                removerItemCompleto(idProduto);
            });
        });
    }

    function atualizarQuantidade(id, acao) {
        let carrinho = carregarCarrinho();
        const item = carrinho.find(i => i.id === id);

        if (item) {
            if (acao === 'adicionar') {
                item.quantidade++;
            } else if (acao === 'remover') {
                item.quantidade--;
                if (item.quantidade < 1) {
                    removerItemCompleto(id);
                    return;
                }
            }
            salvarCarrinho(carrinho);
            renderizarCarrinho();
        }
    }

    function removerItemCompleto(id) {
        let carrinho = carregarCarrinho();
        carrinho = carrinho.filter(item => item.id !== id);
        salvarCarrinho(carrinho);
        renderizarCarrinho();
    }

    finalizarCompraBtn.addEventListener('click', () => {
        let carrinho = carregarCarrinho();
        if (carrinho.length > 0) {
            alert(`Compra de R$ ${calcularTotalCarrinho(carrinho).toFixed(2).replace('.', ',')} finalizada com sucesso! A Mirnas's Delice agradece.`);
            localStorage.removeItem('mirnasDeliceCarrinho');
            renderizarCarrinho();
        } else {
            alert('Seu carrinho está vazio. Adicione produtos antes de finalizar.');
        }
    });

    // Inicia a renderização do carrinho
    renderizarCarrinho();
}); 