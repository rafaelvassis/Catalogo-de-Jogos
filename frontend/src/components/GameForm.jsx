import { useRef, useState } from "react";
import { createGame, updateGame } from "../services/gameService";

/** Menor ano de lançamento aceito no cadastro. */
const MIN_YEAR = 1950;

/** Maior ano aceito: o ano atual + 5, para permitir jogos já anunciados. */
const MAX_YEAR = new Date().getFullYear() + 5;

/**
 * Formulário para cadastrar um jogo novo ou editar um existente.
 *
 * @param {Object} props
 * @param {{id: number, name: string, genre: string, year: number} | null} props.gameBeingEdited
 *   Jogo em edição, ou `null` quando o formulário está no modo de cadastro.
 *   Só é lido na montagem: para carregar outro jogo, remonte o componente
 *   alterando a `key`.
 * @param {() => void} props.onFinish
 *   Chamado ao sair do modo de edição (depois de salvar ou ao cancelar).
 * @param {() => Promise<void>} props.fetchGames
 *   Recarrega a lista de jogos depois de salvar.
 */
export function GameForm({ gameBeingEdited, onFinish, fetchGames }) {
  // O estado inicial vem do jogo em edição. Para trocar de jogo, o pai
  // remonta o componente mudando a `key` (veja App.jsx).
  const [game, setGame] = useState({
    name: gameBeingEdited?.name ?? "",
    genre: gameBeingEdited?.genre ?? "",
    year: gameBeingEdited?.year ?? "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameInputRef = useRef(null);

  // Utils ↓  ↓  ↓  ↓  ↓

  /**
   * Valida os dados do formulário antes do envio.
   * Regras: nome e gênero não podem ficar vazios (espaços em branco não
   * contam) e o ano deve ser um número inteiro entre MIN_YEAR e MAX_YEAR.
   *
   * @param {{name: string, genre: string, year: string | number}} game - Dados atuais do formulário.
   * @returns {{name?: string, genre?: string, year?: string}}
   *   Mensagem de erro de cada campo inválido. Objeto vazio se tudo estiver válido.
   */
  function validateGame(game) {
    const errors = {};

    if (!game.name.trim()) errors.name = "Informe o título.";

    if (!game.genre.trim()) errors.genre = "Informe o gênero.";

    if (game.year === "") {
      errors.year = "Informe o ano.";
    } else {
      const year = Number(game.year);

      if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) {
        errors.year = `O ano deve ser um número inteiro entre ${MIN_YEAR} e ${MAX_YEAR}.`;
      }
    }

    return errors;
  }

  function resetForm() {
    setGame({
      name: "",
      genre: "",
      year: "",
    });
    setFieldErrors({});

    onFinish();
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

    const errors = validateGame(game);

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

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
    setFieldErrors((previousErrors) => ({ ...previousErrors, [name]: undefined }));
    setGame((previousGame) => ({ ...previousGame, [name]: value }));
  };

  return (
    // noValidate: as mensagens de erro são exibidas pelo próprio componente.
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="name">Título </label>
        <input
          type="text"
          name="name"
          id="name"
          ref={nameInputRef}
          value={game.name}
          onChange={handleChange}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
        />
        {fieldErrors.name && <p id="name-error" role="alert">{fieldErrors.name}</p>}
      </div>

      <div>
        <label htmlFor="genre">Gênero </label>
        <input
          type="text"
          name="genre"
          id="genre"
          value={game.genre}
          onChange={handleChange}
          aria-invalid={Boolean(fieldErrors.genre)}
          aria-describedby={fieldErrors.genre ? "genre-error" : undefined}
        />
        {fieldErrors.genre && <p id="genre-error" role="alert">{fieldErrors.genre}</p>}
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
          aria-invalid={Boolean(fieldErrors.year)}
          aria-describedby={fieldErrors.year ? "year-error" : undefined}
        />
        {fieldErrors.year && <p id="year-error" role="alert">{fieldErrors.year}</p>}
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