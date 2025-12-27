import { useState } from "react";
import { CopyIcon, CrownIcon } from "../../../../public/icons/Icons";
import { CATEGORIES } from "../../../utils/constants";

export function RoomInfo({ isHosting, room, pendingPlayers, players }) {
  const [copiedText, setCopiedText] = useState('')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(room?.code)
      setCopiedText('¡Código copiado!')
      setTimeout(() => {
        setCopiedText('')
      }, 5000)
    } catch (err) {
      console.error("Error al copiar: ", err)
    }
  };
  return (
    <>
      {isHosting &&
        <div className="room-code">
          <span className="room-code-text">Código de sala</span>
          <div className="room-code-value">
            <span>{room?.code}</span>
            <CopyIcon onClick={handleCopy} />
          </div>
          <span className="room-code-success-copy">{copiedText}</span>
        </div>
      }
      <div className="room-game-field">
        <div className="room-game-field-title">
          <span className="room-game-field-text">Categoría</span>
          {/* <span className="room-modify-game">Modificar</span> */}
        </div>
        <div className="room-category-value">
          <span>{CATEGORIES[room?.category?.name]?.icon}</span>
          <span>{CATEGORIES[room?.category?.name]?.value}</span>
        </div>
      </div>
      <div className="room-game-field">
        <div className="room-game-field-title">
          <span className="room-game-field-text">Jugadores</span>
          {/* <span className="room-modify-game">Modificar</span> */}
        </div>
        <div className="room-game-players">
          {players?.map((player, i) => (
            <div className="room-game-player-name" key={player.id}>
              <span>{player?.name || `Jugador ${i + 1}`}</span>
              {player.id === room?.hostPlayerId && <CrownIcon />}
            </div>
          ))}
          {pendingPlayers?.length > 0 && pendingPlayers.map((pendingPlayer, i) => (
            <span
              className="room-game-player-name"
              style={{ opacity: .5 }}
              key={i}
            >
              {pendingPlayer.placeholder}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}