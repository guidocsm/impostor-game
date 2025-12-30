import { Title } from "../components/ui/Title";
import { Button } from "../components/ui/Button";
import { useRoomGame } from "../hooks/configGame/useRoomGame";
import { RoomInfo } from "../components/configGame/room/RoomInfo";
import '../css/pages/room.css'
import { SettingsIcon } from "../../public/icons/Icons";
import { useNavigate } from "react-router-dom";

export default function Room() {
  const navigate = useNavigate()
  const {
    room,
    players,
    pendingPlayers,
    isHosting,
    startGame,
    deletePlayerAndUpdatePlayers
  } = useRoomGame()

  const playersInLobby = players.every(player => player?.inLobby)

  return (
    <>
      <div className="room-header">
        <Title
          text="Lobby"
        />
        {isHosting && (
          <div onClick={() => navigate(`/modificar-partida/${room?.id}`)} className="room-settings-container">
            <SettingsIcon width={22} height={22} fill="#E61919" />
            <span className="room-settings-text">Configurar partida</span>
          </div>
        )}
      </div>
      <RoomInfo
        room={room}
        pendingPlayers={pendingPlayers}
        players={players}
        isHosting={isHosting}
      />
      <div className="room-game-config">
        {isHosting && (
          <Button
            text="Iniciar partida"
            disabled={players?.length < room?.players || !playersInLobby}
            onClick={startGame}
          />
        )}
        {!isHosting && players.length === room?.players && playersInLobby && (
          <p className="ready-message">Todo listo. Esperando que el anfitrión empiece la partida.</p>
        )}
        {!isHosting && players.length === room?.players && !playersInLobby && (
          <p className="ready-message">Esperando que los jugadores se unan a la sala</p>
        )}
        <span className="back-link" onClick={deletePlayerAndUpdatePlayers}>Abandonar sala</span>
      </div>
    </>
  )
}