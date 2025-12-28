import { DotIcon } from "../../public/icons/Icons";
import { Title } from "../components/ui/Title";
import { Button } from "../components/ui/Button";
import { useRoomGame } from "../hooks/configGame/useRoomGame";
import { RoomInfo } from "../components/configGame/room/RoomInfo";
import '../css/pages/room.css'

export default function Room() {
  const {
    room,
    players,
    pendingPlayers,
    isHosting,
    startGame,
    deletePlayerAndUpdatePlayers
  } = useRoomGame()
  console.log('room', room)
  return (
    <>
      <div className="room-header">
        <Title
          text="Lobby"
        />
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
            disabled={players?.length < room?.totalPlayers}
            onClick={startGame}
          />
        )}
        {!isHosting && players.length === room?.totalPlayers && (
          <p className="ready-message">Todo listo. Esperando que el anfitrión empiece la partida.</p>
        )}
        <Button
          text="Salir de la sala"
          type="main-hover"
          onClick={deletePlayerAndUpdatePlayers}
        />
      </div>
    </>
  )
}