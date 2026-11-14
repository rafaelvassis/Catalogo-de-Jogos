import { useEffect, useState } from "react";
import { createGame, updateGame } from "../services/gameService";

export function Formulary({ gameBeingEdited, setGameBeingEdited, fetchGames }) {
  const [game, setGame] = useState({
    name: "",
    genre: "",
    year: "",
  });

  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (gameBeingEdited) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGame({
        name: gameBeingEdited.name,
        genre: gameBeingEdited.genre,
        year: gameBeingEdited.year,
      });
    }
  }, [gameBeingEdited]);

  // Utils ↓  ↓  ↓  ↓  ↓

  function inputValidation(game) {
    if (!game.name || !game.genre || !game.year) {
      alert("Preencha todos os campos");

      return false;
    }

    return true;
  }

  function resetForm() {
    setGame({
      name: "",
      genre: "",
      year: "",
    });

    setGameBeingEdited(null);
  }

  
  // Handles  ↓  ↓  ↓  ↓  ↓

  /**
   * Valida e envia o formulário: atualiza o jogo em edição ou cria um novo.
   * Em caso de sucesso, recarrega a lista e limpa o formulário. Em caso de
   * falha na API, exibe uma mensagem de erro e mantém os dados digitados.
   *
   * @param {React.SubmitEvent<HTMLFormElement>} event - Evento de envio do formulário.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!inputValidation(game)) return;

    setSubmitError("");

    try {
      if (gameBeingEdited) {
        await updateGame(gameBeingEdited.id, game);
      } else {
        await createGame(game);
      }

      await fetchGames();
      resetForm();
    } catch {
      setSubmitError("Não foi possível salvar o jogo. Tente novamente.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setGame({ ...game, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Título </label>
        <input
          type="text"
          name="name"
          id="name"
          value={game.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="genre">Gênero </label>
        <input
          type="text"
          name="genre"
          id="genre"
          value={game.genre}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="year">Ano </label>
        <input
          type="number"
          name="year"
          id="year"
          value={game.year}
          onChange={handleChange}
        />
      </div>
      <button type="submit">
        {gameBeingEdited ? "Atualizar Jogo" : "Adicionar Jogo"}
      </button>

      {submitError && <p role="alert">{submitError}</p>}
    </form>
  );
}