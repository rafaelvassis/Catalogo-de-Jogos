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
    setFormKey((key) => key + 1);

    // No celular o formulário fica acima da lista: leva o usuário até ele.
    // Se já estiver visível (tela larga), não rola.
    document
      .getElementById("game-form")
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <>
      <header className="topbar">
        <div className="topbar__inner">
          <span className="topbar__brand">Catálogo de Jogos</span>

          <a className="btn btn--primary btn--small" href="#game-form">
            Adicionar jogo
          </a>
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
    </>
  );
}
export default App;
