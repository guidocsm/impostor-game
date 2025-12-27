import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { fetchRoomByCode } from "../../services/fetch/fetchRoomByCode"

export function useJoinRoom() {
  const [joinRoomForm, setJoinRoomForm] = useState({
    code: '',
    name: ''
  })

  const [roomError, setRoomError] = useState('')

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location?.state?.error) {
      setRoomError(location?.state?.error)
      navigate(location.pathname, { replace: true })
    }
  }, [location])

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
    const room = await fetchRoomByCode(joinRoomForm.code.toUpperCase())

    navigate(`/sala/${room?.id}`, {
      state: {
        playerAccessInfo: joinRoomForm
      }
    })
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