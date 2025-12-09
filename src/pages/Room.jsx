import { useEffect } from "react";
import { CopyIcon, CrownIcon, DotIcon } from "../../public/icons/Icons";
import { Title } from "../components/ui/Title";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useRoomGame } from "../hooks/configGame/useRoomGame";
import '../css/pages/room.css'
import { CATEGORIES } from "../utils/constants";
import { RoomInfo } from "../components/configGame/room/RoomInfo";

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
          style={{ backgroundColor: pendingPlayers?.length > 0 ? '#4A4F574D' : '#6EDFB24D' }}
          className={`room-header-status ${pendingPlayers?.length > 0 ? 'pending-status' : ''}`}
        >
          <DotIcon fill={pendingPlayers?.length > 0 ? '#4A4F57' : '#6EDFB2'} />
          <span style={{ color: pendingPlayers?.length > 0 ? '#4A4F57' : '#6EDFB2' }}>
            {pendingPlayers?.length > 0 ? 'Esperando jugadores' : 'Sala completa'}
          </span>
        </div>
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
        {!isHosting && pendingPlayers?.length === 0 && (
          <p className="ready-message">Todo listo. Esperando que el anfitrión empiece la partida.</p>
        )}
        <Button
          text="Salir de la sala"
          type="main-hover"
          onClick={deletePlayer}
        />
      </div>
    </>
  )
}