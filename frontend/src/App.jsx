import { useEffect, useState } from "react";
import { GameForm } from "./components/GameForm";
import { GameCard } from "./components/GameCard";
import { getGames, deleteGame } from "./services/gameService";

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
  };

  return (
    <>
      <h1>Catálogo de Jogos</h1>

      <div>
        {gameList.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
      <br />
      <GameForm
        key={formKey}
        gameBeingEdited={gameBeingEdited}
        onFinish={() => setGameBeingEdited(null)}
        fetchGames={fetchGames}
      />
    </>
  );
}
export default App;
