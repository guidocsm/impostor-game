export function PlayersSelection({
  label = '',
  players = 0,
  sectionKey = '',
  className = '',
  addPlayer,
  removePlayer
}) {
  return (
    <div className="new-game-box">
      <span className="new-game-box-title">{label}</span>
      <div className="new-game-box-counter">
        <div
          className={`remove-player ${className}`}
          onClick={() => removePlayer(sectionKey)}
        >
          -
        </div>
        <span className="total-players">{players}</span>
        <div
          className="add-player"
          onClick={() => addPlayer(sectionKey)}
        >
          +
        </div>
      </div>
    </div>
  )
}