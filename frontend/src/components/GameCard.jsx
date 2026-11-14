/**
 * Gera um matiz (0-359) estável a partir do nome do jogo, para cada capa
 * ter sempre a mesma cor.
 *
 * @param {string} name - Nome do jogo.
 * @returns {number} Matiz em graus, para usar em `hsl()`.
 */
function hueFromName(name) {
  let hue = 0;

  for (const character of name) {
    hue = (hue * 31 + character.charCodeAt(0)) % 360;
  }

  return hue;
}

export function GameCard({ game, onDelete, onEdit }) {
  const initial = [...game.name.trim()][0]?.toUpperCase() ?? "?";

  return (
    <article className="game-card">
      <div
        className="game-card__cover"
        style={{ "--hue": hueFromName(game.name) }}
        aria-hidden="true"
      >
        <span className="game-card__initial">{initial}</span>
        <span className="badge">{game.year}</span>
      </div>

      <div className="game-card__info">
        <p className="game-card__genre">{game.genre}</p>
        <h3 className="game-card__title" title={game.name}>
          {game.name}
        </h3>
      </div>

      <div className="game-card__actions">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => onEdit(game)}
          aria-label={`Editar ${game.name}`}
        >
          Editar
        </button>
        <button
          type="button"
          className="btn btn--danger"
          onClick={() => onDelete(game.id)}
          aria-label={`Excluir ${game.name}`}
        >
          Excluir
        </button>
      </div>
    </article>
  );
}
