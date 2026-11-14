import { useEffect, useRef, useState } from "react";
import { createGame, updateGame } from "../services/gameService";

/** Menor ano de lançamento aceito no cadastro. */
const MIN_YEAR = 1950;

/** Maior ano aceito: o ano atual + 5, para permitir jogos já anunciados. */
const MAX_YEAR = new Date().getFullYear() + 5;

export function Formulary({ gameBeingEdited, setGameBeingEdited, fetchGames }) {
  const [game, setGame] = useState({
    name: "",
    genre: "",
    year: "",
  });

  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameInputRef = useRef(null);

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

  /**
   * Valida os dados do formulário antes do envio.
   * Regras: nome e gênero não podem ficar vazios (espaços em branco não
   * contam) e o ano deve ser um número inteiro entre MIN_YEAR e MAX_YEAR.
   * Efeito colateral: exibe um `alert` com o motivo quando a validação falha.
   *
   * @param {{name: string, genre: string, year: string | number}} game - Dados atuais do formulário.
   * @returns {boolean} `true` se os dados são válidos; `false` caso contrário.
   */
  function inputValidation(game) {
    if (!game.name.trim() || !game.genre.trim() || !game.year) {
      alert("Preencha todos os campos");

      return false;
    }

    const year = Number(game.year);

    if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) {
      alert(`O ano deve ser um número inteiro entre ${MIN_YEAR} e ${MAX_YEAR}`);

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
   * Nome e gênero são enviados sem espaços nas pontas e o ano como número.
   * Enquanto a requisição está em andamento, o botão fica desabilitado.
   * Em caso de sucesso, recarrega a lista, limpa o formulário, exibe uma
   * confirmação e devolve o foco ao campo de título.
   * Em caso de falha na API, exibe uma mensagem de erro e mantém os dados digitados.
   *
   * @param {React.SubmitEvent<HTMLFormElement>} event - Evento de envio do formulário.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!inputValidation(game)) return;

    setSubmitError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    // O input guarda o ano como string; a API espera um número.
    const gameToSend = {
      name: game.name.trim(),
      genre: game.genre.trim(),
      year: Number(game.year),
    };

    try {
      if (gameBeingEdited) {
        await updateGame(gameBeingEdited.id, gameToSend);
      } else {
        await createGame(gameToSend);
      }

      await fetchGames();
      setSuccessMessage(
        gameBeingEdited
          ? "Jogo atualizado com sucesso."
          : "Jogo adicionado com sucesso.",
      );
      resetForm();
      nameInputRef.current?.focus();
    } catch {
      setSubmitError("Não foi possível salvar o jogo. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Sai do modo de edição, descartando as alterações e limpando o formulário. */
  const handleCancel = () => {
    setSubmitError("");
    setSuccessMessage("");
    resetForm();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSuccessMessage("");
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
          ref={nameInputRef}
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
          min={MIN_YEAR}
          max={MAX_YEAR}
          step={1}
          value={game.year}
          onChange={handleChange}
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? "Salvando..."
          : gameBeingEdited
            ? "Atualizar Jogo"
            : "Adicionar Jogo"}
      </button>

      {gameBeingEdited && (
        <button type="button" onClick={handleCancel} disabled={isSubmitting}>
          Cancelar
        </button>
      )}

      {submitError && <p role="alert">{submitError}</p>}
      {successMessage && <p role="status">{successMessage}</p>}
    </form>
  );
}