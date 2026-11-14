import { useEffect, useState } from "react";
import { GameForm } from "./components/GameForm";
import { GameCard } from "./components/GameCard";
import { getGames, deleteGame } from "./services/gameService";

function App() {
  const [gameList, setGameList] = useState([]);
  const [gameBeingEdited, setGameBeingEdited] = useState(null);

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

  return (
    <>
      <h1>Catálogo de Jogos</h1>

      <div>
        {gameList.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onDelete={handleDelete}
            onEdit={setGameBeingEdited}
          />
        ))}
      </div>
      <br />
      <GameForm
        gameBeingEdited={gameBeingEdited}
        onFinish={() => setGameBeingEdited(null)}
        fetchGames={fetchGames}
      />
    </>
  );
}
export default App;
