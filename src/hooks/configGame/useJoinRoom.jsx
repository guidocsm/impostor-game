import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createPlayer } from "../../services/createPlayer"
import { fetchPlayers } from "../../services/fetch/fetchPlayers"
import { fetchRoomByCode } from "../../services/fetch/fetchRoomByCode"

export function useJoinRoom() {
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
    if (joinRoomForm.code.length === 0) {
      setRoomError('Debes introducir el código de la sala')
      return
    }

    setRoomError('')
    const room = await fetchRoomByCode(joinRoomForm.code)
    const players = await fetchPlayers(room?.id)

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

  return {
    joinForm: joinRoomForm,
    roomError,
    onChangeCode,
    onChangeName,
    setRoomError,
    navigateToRoom
  }

}