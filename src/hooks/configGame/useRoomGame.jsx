import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { fetchRoomById } from "../../services/fetch/fetchRoomById"
import { fetchPlayers } from "../../services/fetch/fetchPlayers"
import { createPlayer } from "../../services/createPlayer"
import { useRoomPresence } from "./useRoomPresence"
import { getCategory } from "../../services/getCategory"
import { createGameSession } from "../../services/createGameSession"
import { setRoomStatus } from "../../services/setRoomStatus"
import { getRandomNumber } from "../../utils/methods"
import { deletePlayer } from "../../services/deletePlayer"
// import { useStartedGameListener } from "../listeners/useStartedGameListener"

export function useRoomGame() {
  const [room, setRoom] = useState(null)
  const [players, setPlayers] = useState([]);

  const { roomId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()

  const playerId = JSON.parse(localStorage.getItem('playerId'))
  console.log('player id', playerId === room?.hostPlayerId)
  console.log('room?.hostPlayerId', room?.hostPlayerId)
  const isHosting = playerId === room?.hostPlayerId

  useRoomPresence(isHosting, setPlayers)
  // useStartedGameListener()

  useEffect(() => {
    (async () => {
      const { room: roomData, error } = await fetchRoomById(roomId)

      if (error) {
        navigate('/unirse', {
          state: { error: 'Ha ocurrido un error. Inténtalo de nuevo' }
        })
      }

      const playersData = await fetchPlayers(roomId)
      const userExists = playersData.some(player => player?.id === playerId)

      if (playersData?.length === roomData?.totalPlayers && !userExists) {
        navigate('/unirse', {
          state: { error: 'Lo sentimos, la sala ya está llena.' }
        })
        return
      }

      if (!userExists) {
        await createPlayer({ name: state?.name, id: roomData?.id })
      }

      if (roomData.status === 'started') {
        navigate(`/partida/${roomId}`);
        return
      }

      setRoom(roomData)
      setPlayers(playersData)
    })()
  }, [roomId])

  const startGame = async () => {
    try {
      const category = await getCategory(room?.category?.id)
      const randomPlayerIndex = getRandomNumber(players.length)
      const randomCategoryIndex = getRandomNumber(category.options.length)

      const gameSessionList = players.map((player, playerIndex) => ({
        player_id: player.id,
        player_name: player.name,
        role: playerIndex === randomPlayerIndex ? 'impostor' : 'tripulante',
        word: category.options[randomCategoryIndex],
        is_host: player.id === players[0].id,
        room_id: roomId,
      }))

      await createGameSession(gameSessionList)
      await setRoomStatus('started')

      navigate(`/partida/${roomId}`);

    } catch (error) {
      console.error('Error starting game:', error)
    }
  }

  const deletePlayerAndUpdatePlayers = async () => {
    try {
      await deletePlayer()
      localStorage.removeItem('playerId')
      const newPlayers = await fetchPlayers(roomId)
      setPlayers(newPlayers)
      navigate('/')
    } catch (error) {
      console.log('error', error)
    }
  }

  const pendingPlayers = Array
    .from({ length: room?.totalPlayers - players?.length })
    .map(x => ({ placeholder: 'Esperando jugador' }))

  return {
    room,
    players,
    pendingPlayers,
    isHosting,
    startGame,
    deletePlayerAndUpdatePlayers,
  }
}