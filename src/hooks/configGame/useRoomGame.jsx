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
import { supabase } from "../../services/supabaseClient"
import { useRoomListener } from "./useRoomListener"
import { IMPOSTORS, PLAYERS } from "../../utils/constants"

export function useRoomGame() {
  const [room, setRoom] = useState(null)
  const [players, setPlayers] = useState([])

  const { roomId } = useParams()
  const { state } = useLocation()

  const navigate = useNavigate()

  const playerId = JSON.parse(localStorage.getItem('playerId'))
  const isHosting = playerId === room?.hostPlayerId

  useRoomPresence(isHosting, setPlayers)
  useRoomListener(roomId, setRoom)

  useEffect(() => {
    (async () => {
      const { room: roomData, error } = await fetchRoomById(roomId)
      if (error || !roomData) {
        navigate('/unirse', {
          state: { error: 'Ha ocurrido un error. Inténtalo de nuevo' }
        })
      }

      await supabase.rpc('set_config', { key: 'request.room_id', value: roomId })

      let playersData = await fetchPlayers(roomId)
      const playerExists = playersData.some(player => player?.id === playerId)

      if (playersData?.length === roomData?.totalPlayers && !playerExists) {
        navigate('/unirse', {
          state: { error: 'Lo sentimos, la sala ya está llena.' }
        })
        return
      }

      if (playerExists) {
        setPlayers(playersData)
      } else {
        if (!state?.playerAccessInfo?.code || (state?.playerAccessInfo?.code.toUpperCase() !== roomData?.code)) {
          navigate('/unirse', { state: { error: 'Código de acceso inválido.' } })
          return
        }

        await createPlayer({ name: state?.playerAccessInfo?.name, id: roomData?.id })
        playersData = await fetchPlayers(roomId)
        setPlayers(playersData)
      }

      if (roomData.status === 'started') {
        navigate(`/partida/${roomId}`)
        return
      }

      setRoom(roomData)
    })()
  }, [roomId])

  useEffect(() => {
    if (room?.status === 'started') {
      navigate(`/partida/${roomId}`);
    }
  }, [room, roomId, navigate]);

  const startGame = async () => {
    try {
      const category = await getCategory({ categoryId: room?.category?.id })
      const randomPlayerIndex = getRandomNumber(players.length)
      // const randomCategoryIndex = getRandomNumber(category.options.length)

      const impostorId = players[randomPlayerIndex].id
      const randomCategoryIndex = getRandomNumber(category.options.length)
      const shuffledPlayers = shuffleArray(players)

      const gameSessionList = shuffledPlayers.map((player) => ({
        player_id: player.id,
        player_name: player.name,
        role: player?.id === impostorId ? IMPOSTORS : PLAYERS,
        word: category.options[randomCategoryIndex],
        is_host: player.id === players[0].id,
        room_id: roomId,
        category: room?.category?.name,
        players: shuffledPlayers.map(player => ({ id: player?.id, name: player?.name })),
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

  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
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