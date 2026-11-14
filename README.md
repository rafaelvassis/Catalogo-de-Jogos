# Catálogo de Jogos

Catálogo de jogos com CRUD completo: cadastre, liste, edite e exclua jogos (título, gênero e ano). Projeto de portfólio com API em ASP.NET Core e frontend em React, publicado na Vercel.

**Demo:** https://game-catalog-lovat.vercel.app

> Roda em planos gratuitos: a primeira visita depois de um tempo parado pode demorar alguns segundos, e a lista pode aparecer vazia (veja [Limitações](#limitações-e-próximos-passos)).

## Funcionalidades

- CRUD de jogos, com validação por campo e mensagens de erro claras
- Interface responsiva, pensada primeiro para celular (mobile first)
- PWA: pode ser instalado como app
- Tratamento de falhas da API, com opção de tentar novamente

## Stack

| Camada   | Tecnologias                                          |
| -------- | ---------------------------------------------------- |
| Backend  | ASP.NET Core (.NET 10), Minimal API, Docker          |
| Frontend | React 19, Vite, CSS puro, PWA (`vite-plugin-pwa`)    |
| Deploy   | Vercel (frontend estático e backend em contêiner)    |

## Arquitetura

O frontend é uma SPA que conversa com a API por REST, em JSON.

```
game-catalog/
├── backend/             # API
│   ├── Program.cs       # endpoints, CORS e lista de jogos em memória
│   ├── Models/          # Game e os requests de criação/atualização
│   └── Dockerfile       # imagem usada no deploy
└── frontend/            # SPA em React (veja frontend/README.md)
    └── src/
        ├── App.jsx
        ├── components/  # GameForm e GameCard
        └── services/    # gameService.js: chamadas à API
```

- O ID do jogo é gerado pelo backend.
- Toda comunicação HTTP do frontend passa por `gameService.js`.
- As origens liberadas no CORS vêm da variável `CORS_ORIGINS`.

### Endpoints

| Método | Rota          | Descrição        |
| ------ | ------------- | ---------------- |
| GET    | `/games`      | Lista os jogos   |
| POST   | `/games`      | Cria um jogo     |
| PUT    | `/games/{id}` | Atualiza um jogo |
| DELETE | `/games/{id}` | Exclui um jogo   |

Em desenvolvimento, o documento OpenAPI fica em `/openapi/v1.json`.

## Como rodar localmente

Pré-requisitos: [.NET 10 SDK](https://dotnet.microsoft.com/download) e [Node.js](https://nodejs.org/).

**1. Backend** (http://localhost:5224)

```bash
cd backend
dotnet run
```

**2. Frontend** (http://localhost:5173), em outro terminal

```bash
cd frontend
npm install
npm run dev
```

Para rodar a API em contêiner (porta 8080), com o Docker:

```bash
docker build -t game-catalog-api backend
docker run --rm -p 8080:8080 game-catalog-api
```

Nesse caso, aponte o frontend para ela criando `frontend/.env` com `VITE_API_URL=http://localhost:8080`.

## Variáveis de ambiente

| Variável       | Onde     | Para que serve                                                                 |
| -------------- | -------- | ------------------------------------------------------------------------------ |
| `VITE_API_URL` | frontend | Endereço da API, sem `/games` e sem barra no fim. Padrão: `http://localhost:5224`. É embutida no build. |
| `CORS_ORIGINS` | backend  | Origens do frontend liberadas, separadas por vírgula. Padrão: `localhost:5173` e `localhost:4173`. |
| `PORT`         | backend  | Porta que a Vercel usa para falar com o contêiner (`8080`).                    |

## Deploy

Dois projetos na Vercel, a partir do mesmo repositório:

1. **Backend:** diretório raiz `backend`, variável `PORT=8080`.
2. **Frontend:** diretório raiz `frontend`, preset Vite, variável `VITE_API_URL` com o endereço do backend.
3. No backend, defina `CORS_ORIGINS` com o endereço do frontend e faça um novo deploy.

Use sempre o domínio de produção: os endereços de cada deploy individual são protegidos pela Vercel e bloqueados pelo CORS.

## Limitações e próximos passos

- **Dados em memória:** reiniciar a API apaga a lista, o que acontece depois de alguns minutos sem tráfego no plano gratuito. Próximo passo: persistir em PostgreSQL (Neon) com Entity Framework Core.
- **Validação só no frontend:** o backend ainda não valida as entradas.
- **Sem testes automatizados** nem CI.

---

Desenvolvido por [Rafael Vassis](https://github.com/rafaelvassis).
