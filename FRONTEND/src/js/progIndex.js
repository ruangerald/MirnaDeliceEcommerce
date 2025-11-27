document.addEventListener('DOMContentLoaded', () => {
    let token = sessionStorage.getItem('token');
    let loginUsuario = document.getElementById('loginUsuario');
    let carrinhoCompra = document.getElementById('carrinhoCompra');
    
    // --- Funções de Navegação (mantendo sua lógica de login) ---

    loginUsuario.addEventListener('click', () => {
        if (!token) {
            window.location.href = "./html/loginUsuario.html";
        } else {
            window.location.href = "./html/usuario.html";
        }
    });

    });

    carrinhoCompra.addEventListener('click', () =>{
        window.location.href = "./html/carrinho.html"
    })

// --- Lógica de Carrinho (Disponível globalmente para onclick) ---

/**
 * Carrega o carrinho do localStorage.
 * @returns {Array} Lista de itens no carrinho.
 */
function carregarCarrinho() {
    return JSON.parse(localStorage.getItem('mirnasDeliceCarrinho')) || [];
}

/**
 * Salva o carrinho no localStorage.
 * @param {Array} carrinho - Lista de itens no carrinho.
 */
function salvarCarrinho(carrinho) {
    localStorage.setItem('mirnasDeliceCarrinho', JSON.stringify(carrinho));
}

/**
 * Adiciona um produto ao carrinho e redireciona.
 * Esta função é chamada via 'onclick' nos botões dos produtos.
 * @param {HTMLElement} element - O botão que foi clicado.
 */
function addCart(element) {
    const card = element.closest('.produto-card');
    
    if (!card) {
        console.error("Não foi possível encontrar o card do produto.");
        return;
    }
    
    const id = card.getAttribute('data-id');
    const nome = card.getAttribute('data-nome');
    const precoString = card.getAttribute('data-preco');
    const preco = parseFloat(precoString);

    if (!id || !nome || isNaN(preco)) {
        alert("Dados do produto incompletos.");
        return;
    }

    let carrinho = carregarCarrinho();
    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({ id, nome, preco, quantidade: 1 });
    }

    salvarCarrinho(carrinho);
    
    // Alerta o usuário e segue para a próxima etapa (redirecionar para o carrinho)
    alert(`"${nome}" adicionado! Indo para o carrinho.`);
    
    // Ação pós-adição: Redireciona o usuário para a página do carrinho (carrinho.html)
    // Usamos window.location.href diretamente, pois esta função é global (chamada por onclick)
    window.location.href = "./html/carrinho.html";
}

// --- Funções Auxiliares para serem usadas em carrinho.html ---

/**
 * Retorna o total dos itens no carrinho.
 * @returns {number} O valor total.
 */
function calcularTotalCarrinho() {
    const carrinho = carregarCarrinho();
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
}

/**
 * Limpa o carrinho.
 */
function limparCarrinho() {
    localStorage.removeItem('mirnasDeliceCarrinho');
}