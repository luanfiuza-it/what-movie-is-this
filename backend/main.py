# Importamos as ferramentas necessárias do FastAPI
from fastapi import FastAPI, HTTPException, Query
# Importamos o middleware de CORS para permitir que o front-end acesse o back-end
from fastapi.middleware.cors import CORSMiddleware
# Biblioteca nativa do Python para fazer requisições HTTP (conversar com o TMDB)
import requests
# Ferramentas para carregar as variáveis de ambiente do arquivo .env
import os
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env para que o Python consiga lê-las
load_dotenv()

# Instancia a nossa aplicação FastAPI
app = FastAPI(
    title="What Movie Is This? API",
    description="Back-end intermediário para busca de filmes consumindo a API do TMDB",
    version="1.0.0"
)

# ==========================================================
# CONFIGURAÇÃO DE CORS (Segurança do Navegador)
# ==========================================================
# Como o seu front-end e o seu back-end rodam em portas/endereços diferentes, 
# precisamos dizer ao FastAPI que o seu front-end é "confiável" e tem permissão para pedir dados.
origins = [
    "http://localhost",
    "http://127.0.0.1",
    # Permite requisições vindas do Live Server do VS Code ou arquivos locais abertos no navegador
    "*", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Lista de sites que podem acessar a API
    allow_credentials=True,
    allow_methods=["*"],              # Permite todos os métodos HTTP (GET, POST, etc.)
    allow_headers=["*"],              # Permite todos os cabeçalhos HTTP
)

# Recupera a chave da API do TMDB que guardamos no arquivo backend/.env
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

# Uma verificação de segurança simples: se você esqueceu de preencher o .env, o servidor avisa no terminal
if not TMDB_API_KEY:
    print("❌ ERRO: A variável TMDB_API_KEY não foi encontrada no arquivo .env!")

# ==========================================================
# ROTA PRINCIPAL DE BUSCA (/api/search)
# ==========================================================
# Criamos uma rota do tipo GET que o JavaScript vai chamar como: /api/search?title=NomeDoFilme
@app.get("/api/search")
def search_movie(title: str = Query(..., description="Nome do filme a ser pesquisado")):
    """
    Rota que recebe o título de um filme do front-end, adiciona a chave de API 
    e busca as informações diretamente na API oficial do TMDB.
    """
    # Se a chave não estiver configurada no .env, barramos a requisição com erro 500 (Erro interno do servidor)
    if not TMDB_API_KEY:
        raise HTTPException(status_code=500, detail="Chave da API do TMDB não configurada no servidor.")

    # URL oficial do endpoint de busca de filmes do TMDB (Versão 3 da API)
    tmdb_url = "https://api.themoviedb.org/3/search/movie"

    # Dicionário com os parâmetros exigidos pelo TMDB:
    # - api_key: sua chave de acesso
    # - query: o nome do filme que veio lá do front-end
    # - language: traz os textos (sinopse, título) traduzidos para português do Brasil
    # - include_adult: remove resultados de conteúdo adulto/pornografia por padrão
    params = {
        "api_key": TMDB_API_KEY,
        "query": title,
        "language": "pt-BR",
        "include_adult": "false"
    }

    try:
        # Faz a requisição HTTP do tipo GET para o TMDB, enviando os parâmetros acima
        # O timeout=5 garante que se o TMDB estiver fora do ar, o nosso código desiste após 5 segundos e não trava
        response = requests.get(tmdb_url, params=params, timeout=5)
        
        # Se o TMDB retornar algum código de erro (como 401 por chave inválida, por exemplo), dispara uma exceção
        response.raise_for_status()
        
        # Transforma a resposta que veio do TMDB em um dicionário Python (JSON)
        data = response.json()
        
        # Retorna os dados limpos diretamente para o nosso JavaScript no front-end
        return data

    except requests.exceptions.RequestException as error:
        # Se acontecer qualquer erro de rede (falta de internet, API do TMDB fora do ar, etc.),
        # nós capturamos o erro e respondemos ao front-end de forma amigável com um erro 502 (Bad Gateway)
        raise HTTPException(status_code=502, detail=f"Erro ao comunicar com a API do TMDB: {str(error)}")