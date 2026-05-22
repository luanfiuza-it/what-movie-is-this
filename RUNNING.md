## 📦 Como Configurar e Rodar o Projeto

Siga os passos abaixo para executar o projeto localmente.

---

## 1️⃣ Clonar o Repositório

Abra o terminal e execute:

```bash
git clone https://github.com/luanfiuza-it/what-movie-is-this.git
cd what-movie-is-this
```

---

## 2️⃣ Configurar as Variáveis de Ambiente (`.env`)

Para o backend se comunicar com o TMDB, você precisará gerar uma chave de API gratuita.

### Passos:

1. Acesse o site do TMDB:
   - https://www.themoviedb.org/

2. Crie uma conta

3. Vá em:
   - Perfil → Settings → API

4. Gere sua chave de API

---

### Criando o arquivo `.env`

Dentro da pasta `backend/`, crie um arquivo chamado:

```plaintext
.env
```

E adicione:

```env
TMDB_API_KEY=sua_chave_aqui_sem_aspas
```

> 💡 O arquivo `.env` está protegido pelo `.gitignore`, então sua chave nunca será enviada para o GitHub.

---

## 3️⃣ Executando o Backend

Entre na pasta backend:

```bash
cd backend
```

Execute o servidor:

```bash
python main.py
```

O backend iniciará localmente aguardando requisições do frontend.

---

## 4️⃣ Executando o Frontend

Abra outra aba do terminal:

```bash
cd frontend
```

Depois:

- Abra o arquivo `index.html` no navegador

ou utilize extensões como:

- Live Server (VS Code)

---

## 📂 Estrutura do Projeto

```plaintext
what-movie-is-this/
│
├── backend/
│   ├── .env
│   ├── main.py
│   └── __pycache__/
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   └── app.js
│   │
│   └── index.html
│
└── .gitignore
```

---

## 📌 Funcionalidades

- 🔎 Busca de filmes em tempo real
- 🎬 Integração com a API do TMDB
- ⚡ Atualização dinâmica sem reload
- 🔐 Proteção de credenciais
- 📁 Estrutura separada entre frontend e backend
- 🧠 Organização baseada em arquitetura moderna

---

## 🧑‍💻 Objetivo do Projeto

Este projeto foi desenvolvido com foco em:

- boas práticas de arquitetura web
- separação de responsabilidades
- consumo de APIs REST
- segurança de infraestrutura
- integração frontend/backend
- organização profissional de repositórios GitHub

---

## 🎥 API Utilizada

- [TMDB — The Movie Database](https://www.themoviedb.org/)

---

## 📄 Licença

Este projeto é apenas para fins educacionais e de estudo.

---

# ⭐ Desenvolvido por Luan Fiuza

Projeto desenvolvido para prática de desenvolvimento web moderno utilizando Python, JavaScript e integração com APIs externas.
```