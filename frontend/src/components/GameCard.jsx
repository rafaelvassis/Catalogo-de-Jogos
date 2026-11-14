export function GameCard({game, onDelete, onEdit}) {
  

  return (
    <div>
        <h3>{game.name}</h3>  
        <p>
          {game.genre} • {game.year}
        </p>
        <button onClick={() => onEdit(game)}>Editar</button>
        <button onClick={() => onDelete(game.id)}>Excluir</button>
    </div>
  )
}
