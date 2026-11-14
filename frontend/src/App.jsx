import { useEffect, useState } from "react";
import { GameForm } from "./components/GameForm";
import { GameCard } from "./components/GameCard";
import { getGames, deleteGame } from "./services/gameService";
import "./App.css";

function App() {
  const [gameList, setGameList] = useState([]);
  const [gameBeingEdited, setGameBeingEdited] = useState(null);
  // Muda a cada clique em "Editar" para remontar o formulário, mesmo
  // quando o jogo clicado é o mesmo.
  const [formKey, setFormKey] = useState(0);
  // Se o formulário deve focar o título ao ser remontado (botão "Adicionar jogo").
  const [focusName, setFocusName] = useState(false);

  // Fetch games from backend API
  const fetchGames = async () => {
    const games = await getGames();

    setGameList(games);
  };

  // Render games list
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGames();
  }, []);


  const handleDelete = async (idToDelete) => {
    await deleteGame(idToDelete);
    await fetchGames();
  };

  const handleEdit = (gameToEdit) => {
    setGameBeingEdited(gameToEdit);
    setFocusName(false);
    setFormKey((key) => key + 1);

    // No celular o formulário fica acima da lista: leva o usuário até ele.
    // Se já estiver visível (tela larga), não rola.
    document
      .getElementById("game-form")
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  // Cancela uma edição em andamento e deixa o formulário limpo, com o foco
  // no título. Remontar o formulário (nova key) limpa campos e mensagens.
  const handleNewGame = () => {
    setGameBeingEdited(null);
    setFocusName(true);
    setFormKey((key) => key + 1);
  };

  return (
    <>
      <header className="topbar">
        <div className="topbar__inner">
          <span className="topbar__brand">Catálogo de Jogos</span>

          <button
            type="button"
            className="btn btn--primary btn--small"
            onClick={handleNewGame}
          >
            Adicionar jogo
          </button>
        </div>
      </header>

      <div className="app">
        <div className="page-header">
          <h1 id="page-title">Meus jogos</h1>
          <p className="page-header__count">
            Mostrando {gameList.length} {gameList.length === 1 ? "jogo" : "jogos"}.
          </p>
        </div>

        <main className="layout">
          <GameForm
            key={formKey}
            gameBeingEdited={gameBeingEdited}
            autoFocusName={focusName}
            onFinish={() => setGameBeingEdited(null)}
            fetchGames={fetchGames}
          />

          <section className="games" aria-labelledby="page-title">
            {gameList.length === 0 ? (
              <p className="games__empty">
                Nenhum jogo cadastrado ainda. Use o formulário para adicionar
                o primeiro!
              </p>
            ) : (
              <ul className="games__list">
                {gameList.map((game) => (
                  <li key={game.id}>
                    <GameCard
                      game={game}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>

      <footer className="footer">
        <p>
          © 2026 · Game Catalog | Desenvolvido por{" "}
          <a
            href="https://github.com/rafaelvassis"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rafael Vassis
          </a>
        </p>
      </footer>
    </>
  );
}
export default App;
