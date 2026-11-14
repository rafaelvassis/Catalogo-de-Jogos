# Game Catalog · Frontend

Interface do catálogo de jogos: lista, cadastra, edita e exclui jogos consumindo a API do backend. Layout responsivo, pensado primeiro para celular (mobile first).

## Stack

- React 19
- Vite
- CSS puro
- ESLint

## Estrutura

```
src/
├── App.jsx            # estado da página e composição dos componentes
├── components/
│   ├── GameForm.jsx   # formulário de cadastro e edição, com validação
│   └── GameCard.jsx   # card de um jogo, com ações de editar e excluir
├── services/
│   └── gameService.js # todas as chamadas HTTP à API
├── App.css            # layout e componentes
└── index.css          # tokens de design (cores, espaçamentos) e base
```

## Como rodar

O backend precisa estar rodando (veja `../backend`).

```bash
npm install
npm run dev
```

Abre em http://localhost:5173.

| Comando           | O que faz                    |
| ----------------- | ---------------------------- |
| `npm run dev`     | Servidor de desenvolvimento  |
| `npm run build`   | Gera a versão de produção    |
| `npm run preview` | Serve o build localmente     |
| `npm run lint`    | Verifica o código com ESLint |

## Configuração

Por padrão o frontend usa a API em `http://localhost:5224`. Para mudar, copie `.env.example` para `.env` e ajuste:

```
VITE_API_URL=http://localhost:5224
```

Reinicie o `npm run dev` depois de alterar o `.env`.
