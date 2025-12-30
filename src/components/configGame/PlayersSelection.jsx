import { AddIcon, RemoveIcon } from "../../../public/icons/Icons";
import { IMPOSTORS } from "../../utils/constants";

const getDifficultyLabel = (impostors) => {
  if (impostors === 1) return '(fácil)'
  if (impostors === 2) return '(medio)'
  return '(difícil)'
}

export function PlayersSelection({
  label = '',
  players = 0,
  sectionKey = '',
  isMin = false,
  isMax = false,
  addPlayer,
  removePlayer
}) {
  return (
    <div className="new-game-box">
      <span className="new-game-box-title">{label}</span>
      <div className="new-game-box-counter">
        <div
          className={`remove-player ${isMin ? 'disabled' : ''}`}
          onClick={() => removePlayer(sectionKey)}
        >
          <RemoveIcon />
        </div>
        <div className="total-players-container">
          <span className="total-players">{players}</span>
          {sectionKey === IMPOSTORS && (
            <span className="impostor-difficulty">{getDifficultyLabel(players)}</span>
          )}
        </div>
        <div
          className={`add-player ${isMax ? 'disabled' : ''}`}
          onClick={() => addPlayer(sectionKey)}
        >
          <AddIcon />
        </div>
      </div>
    </div>
  )
}
