import { Title } from "../components/ui/Title";
import '../css/pages/joinRoom.css'
import { JoinRoomForm } from "../components/configGame/room/JoinRoomForm";
import { useJoinRoom } from "../hooks/configGame/useJoinRoom";

export default function JoinRoom() {
  const {
    joinForm,
    roomError,
    onChangeCode,
    onChangeName,
    setRoomError,
    navigateToRoom,
  } = useJoinRoom()
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
    </>
  )
} 