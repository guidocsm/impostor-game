import { useEffect } from "react";
import { CopyIcon, CrownIcon, DotIcon } from "../../public/icons/Icons";
import { Title } from "../components/ui/Title";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useRoomGame } from "../hooks/configGame/useRoomGame";
import '../css/pages/room.css'
import { CATEGORIES } from "../utils/constants";

export default function Room() {
  const playerId = JSON.parse(localStorage.getItem('playerId'))

  const {
    room,
    players,
    pendingPlayers,
    isHosting,
    startGame,
    deletePlayer
  } = useRoomGame()

  const navigate = useNavigate()

  useEffect(() => {
    if (!playerId) {
      navigate('/')
      return
    }
  }, [])

  return (
    <>
      <div className="room-header">
        <Title
          text="Lobby"
        />
        <div
          style={{ backgroundColor: pendingPlayers?.length > 0 ? '#FFD4494D' : '#6EDFB24D' }}
          className={`room-header-status ${pendingPlayers?.length > 0 ? 'pending-status' : ''}`}
        >
          <DotIcon
            fill={pendingPlayers?.length > 0 ? '#FFD449' : '#6EDFB2'}
          />
          <span
            style={{ color: pendingPlayers?.length > 0 ? '#FFD449' : '#6EDFB2' }}
          >
            {pendingPlayers?.length > 0 ? 'Esperando jugadores' : 'Sala completa'}
          </span>
        </div>
      </div>
      {isHosting &&
        <div className="room-code">
          <span className="room-code-text">Código de sala</span>
          <div className="room-code-value">
            <span>{room?.code}</span>
            <CopyIcon />
          </div>
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
          <span className="room-game-players-counter">{players?.length}/{room?.totalPlayers}</span>
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
      <div className="room-game-config">
        {isHosting && (
          <Button
            text="Iniciar partida"
            disabled={players?.length < room?.totalPlayers}
            onClick={startGame}
          />
        )}
        {!isHosting && pendingPlayers?.length === 0 && (
          <p className="ready-message">Todo listo. Esperando que el anfitrión empiece la partida.</p>
        )}
        <Button
          text="Salir de la sala"
          type="disabled-hover"
          onClick={deletePlayer}
        />
      </div>
    </>
  )
}