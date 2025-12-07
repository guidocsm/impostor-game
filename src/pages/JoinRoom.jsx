import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Title } from "../components/ui/Title";
import '../css/pages/joinRoom.css'
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { createPlayer } from "../services/createPlayer";
import { fetchRoomByCode } from "../services/fetch/fetchRoomByCode";
import { fetchPlayers } from "../services/fetch/fetchPlayers";

export default function JoinRoom() {
  const [joinRoomForm, setJoinRoomForm] = useState({
    code: '',
    name: ''
  })

  const [roomError, setRoomError] = useState('')

  const navigate = useNavigate()

  const onChangeCode = (code) => {
    setJoinRoomForm(prevForm => ({ ...prevForm, code }))
  }

  const onChangeName = (name) => {
    setJoinRoomForm(prevForm => ({ ...prevForm, name }))
  }

  const navigateToRoom = async () => {
    setRoomError('')
    const room = await fetchRoomByCode(joinRoomForm.code)
    const players = await fetchPlayers(room?.id)
    console.log('room', room)
    console.log('players', players)

    if (room?.totalPlayers === players?.length) {
      setRoomError('Lo sentimos, la sala ya está llena.')
      return
    }

    const payload = {
      roomId: room?.id,
      name: joinRoomForm.name,
    }

    await createPlayer(payload)
    navigate(`/sala/${room?.id}`)
  }

  return (
    <>
      <Title
        text="Unirse a una sala"
      />
      <p>Ingresa el código de la sala y tu nombre</p>
      <form className="join-room-form" action="">
        <div className="form-container">
          <label htmlFor="">Código de sala</label>
          <input
            type="text"
            onChange={({ target }) => onChangeCode(target.value)}
          />
        </div>
        <div className="form-container">
          <label htmlFor="">Tu nombre</label>
          <input
            type="text"
            onChange={({ target }) => onChangeName(target.value)}
          />
        </div>
      </form>
      <div className="join-room-cta">
        <Button
          text="Unirme a la sala"
          onClick={navigateToRoom}
        />
      </div>
      <p className="room-error">{roomError}</p>
    </>
  )
} 