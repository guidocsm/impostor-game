import { Title } from "../components/ui/Title";
import '../css/pages/joinRoom.css'
import { JoinRoomForm } from "../components/configGame/room/JoinRoomForm";
import { useJoinRoom } from "../hooks/configGame/useJoinRoom";
import { useNavigate } from "react-router-dom";

export default function JoinRoom() {
  const {
    joinForm,
    roomError,
    onChangeCode,
    onChangeName,
    setRoomError,
    navigateToRoom,
  } = useJoinRoom()

  const navigate = useNavigate()

  return (
    <>
      <Title text="Unirse a una sala" />
      <JoinRoomForm
        joinForm={joinForm}
        roomError={roomError}
        onChangeCode={onChangeCode}
        onChangeName={onChangeName}
        setRoomError={setRoomError}
        navigateToRoom={navigateToRoom}
      />
      <span onClick={() => navigate('/')} className="join-room-back">Volver</span>
    </>
  )
} 