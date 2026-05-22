/* ==========================================================
   1. MAPEAMENTO DO DOM (Pegando as tags do HTML)
   ========================================================== */
// Aqui nós "capturamos" os elementos do HTML pelo ID deles para podermos manipulá-los no JS.
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const moviesContainer = document.getElementById('movies-container');
const messageContainer = document.getElementById('message-container');

// Esta será a URL base do nosso futuro back-end em FastAPI.
// Quando o FastAPI estiver rodando, ele ficará "escutando" na porta 8000.
const BACKEND_URL = 'http://localhost:8000'; 

/* ==========================================================
   2. EVENTO DE BUSCA (Quando o usuário clica no botão ou dá Enter)
   ========================================================== */
// Adicionamos um "ouvinte de eventos" (addEventListener) no formulário. 
// Ele fica esperando o evento de 'submit' (envio) acontecer.
searchForm.addEventListener('submit', async (event) => {
    
    // O comportamento padrão de um formulário no HTML é recarregar a página.
    // O preventDefault() cancela isso, permitindo que a gente faça tudo por baixo dos panos (assíncrono).
    event.preventDefault(); 

    // Pega o texto que o usuário digitou e usa o .trim() para cortar espaços em branco inúteis no começo ou fim.
    const query = searchInput.value.trim();

    // Se o usuário não digitou nada, não fazemos nada e paramos a função aqui.
    if (!query) return;

    // Limpa a tela de resultados antigos e mostra a mensagem de "Buscando..."
    clearResults();
    showMessage('Buscando filmes...', 'loading');

    // Tenta executar a busca chamando a nossa função principal
    try {
        await fetchMovies(query);
    } catch (error) {
        // Se a internet cair ou o back-end estiver desligado, cai aqui no catch (erro).
        console.error('Erro na requisição:', error);
        showMessage('Erro ao conectar com o servidor. O back-end está rodando?', 'error');
    }
});

/* ==========================================================
   3. FUNÇÃO DE REQUISIÇÃO (Conversando com o Back-end)
   ========================================================== */
// O "async" diz que essa função vai levar um tempo para terminar (depende da rede/internet).
async function fetchMovies(movieName) {
    
    // Faz a chamada (fetch) para a rota do nosso FastAPI, passando o nome do filme na URL.
    // O "await" manda o código esperar a resposta chegar antes de continuar.
    const response = await fetch(`${BACKEND_URL}/api/search?title=${encodeURIComponent(movieName)}`);
    
    // Verifica se a resposta do servidor deu algum erro (ex: Erro 500 ou 404).
    if (!response.ok) {
        throw new Error('Falha na resposta do servidor');
    }

    // Transforma a resposta de texto plano para um Objeto JavaScript (JSON) que podemos manipular.
    const data = await response.json();

    // Oculta a mensagem de "Buscando..." já que a resposta chegou.
    hideMessage();

    // Verifica se a API não retornou nenhum filme (lista vazia).
    if (data.results && data.results.length === 0) {
        showMessage('Nenhum filme encontrado com esse nome. Tente outro!', 'info');
        return;
    }

    // Se achou filmes, envia a lista de resultados para a função que desenha os cards na tela.
    renderMovies(data.results);
}

/* ==========================================================
   4. FUNÇÃO DE RENDERIZAÇÃO (Desenhando na tela)
   ========================================================== */
// Recebe o array (lista) de filmes e cria o HTML de cada um.
function renderMovies(movies) {
    
    // O .map() percorre a lista de filmes, um por um.
    const moviesHTML = movies.map(movie => {
        
        // A API do TMDB retorna só o final do link da imagem. Precisamos colocar o começo oficial deles.
        // Se o filme não tiver imagem (null), colocamos uma imagem genérica de "Sem Pôster".
        const imageUrl = movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
            : 'https://via.placeholder.com/500x750?text=Sem+Poster';
        
        // Pega a data de lançamento e extrai só o ano (ex: "2014-10-22" vira "2014").
        const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
        
        // Arredonda a nota do filme para 1 casa decimal.
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'S/N';

        // Aqui nós criamos o bloco de HTML daquele card de filme usando "Template Literals" (crases).
        // Injetamos as variáveis usando ${...}
        return `
            <div class="movie-card">
                <img src="${imageUrl}" alt="Pôster de ${movie.title}">
                <div class="movie-info">
                    <h3>${movie.title} (${releaseYear})</h3>
                    <span class="rating">⭐ ${rating}</span>
                    <p class="overview">${movie.overview || 'Sinopse não disponível para este filme.'}</p>
                </div>
            </div>
        `;
    }).join(''); // O .join('') junta todos os cards gerados em um único texto contínuo.

    // Por fim, injeta (escreve) todo esse HTML gerado dentro daquela div vazia lá no nosso index.html!
    moviesContainer.innerHTML = moviesHTML;
}

/* ==========================================================
   5. FUNÇÕES AUXILIARES (Limpando e mostrando mensagens)
   ========================================================== */

// Apaga os filmes que estão na tela no momento
function clearResults() {
    moviesContainer.innerHTML = '';
}

// Mostra mensagens na tela (Buscando, Erros, etc.) e remove a classe "hidden" que escondia a div
function showMessage(text, type) {
    messageContainer.textContent = text;
    messageContainer.classList.remove('hidden');
}

// Volta a esconder a caixa de mensagens recolocando a classe "hidden"
function hideMessage() {
    messageContainer.classList.add('hidden');
    messageContainer.textContent = '';
}