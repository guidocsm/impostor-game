import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { fetchRoomById } from "../../services/fetch/fetchRoomById"
import { fetchPlayers } from "../../services/fetch/fetchPlayers"
import { createPlayer } from "../../services/createPlayer"
import { useRoomPresence } from "./useRoomPresence"
import { getCategory } from "../../services/getCategory"
import { updateGameSession } from "../../services/updateGameSession"
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

  useRoomPresence(setPlayers)
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

      if (!playerExists) {
        if (!state?.playerAccessInfo?.code || (state?.playerAccessInfo?.code.toUpperCase() !== roomData?.code)) {
          navigate('/unirse', { state: { error: 'Código de acceso inválido.' } })
          return
        }

        await createPlayer({ name: state?.playerAccessInfo?.name, id: roomData?.id })
        playersData = await fetchPlayers(roomId)
      }

      setPlayers(playersData)

      if (roomData.status === 'started') {
        navigate(`/partida/${roomId}`)
        return
      }

      setRoom(roomData)
    })()
  }, [roomId])

  useEffect(() => {
    let mounted = true

      ; (async () => {
        await supabase
          .from('players')
          .update({ inLobby: true })
          .eq('id', playerId)
      })()

    const channel = supabase.channel(`room-${roomId}`)

    channel.on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'players',
      filter: `roomId=eq.${roomId}`
    },
      (payload) => {
        if (!mounted) return

        if (payload.eventType === 'INSERT') {
          setPlayers(prev => [...prev, payload.new])
        } else if (payload.eventType === 'UPDATE') {
          setPlayers(prev =>
            prev.map(p => (p.id === payload.new.id ? payload.new : p))
          )
        } else if (payload.eventType === 'DELETE') {
          setPlayers(prev => prev.filter(p => p.id !== payload.old.id))
        }
      }
    )
    channel.subscribe()
    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [roomId, playerId])

  useEffect(() => {
    if (room?.status === 'started') {
      navigate(`/partida/${roomId}`)
    }
  }, [room])

  const startGame = async () => {
    try {
      const category = await getCategory({ categoryId: room?.category?.id })
      const randomPlayerIndex = getRandomNumber(players.length)

      const impostorId = players[randomPlayerIndex].id
      const randomCategoryIndex = getRandomNumber(category.options.length)
      const shuffledPlayers = shuffleArray(players)

      const gameSession = {
        word: category.options[randomCategoryIndex],
        roomId: roomId,
        category: room?.category?.name,
        players: shuffledPlayers.map(player => ({
          id: player?.id,
          name: player?.name,
          role: player?.id === impostorId ? IMPOSTORS : PLAYERS,
          isHost: player.id === players[0].id,
        }))
      }

      await updateGameSession(gameSession)

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
    .from({ length: room?.players - players?.length })
    .map(() => ({ placeholder: 'Esperando jugador' }))

  const isHosting = useMemo(() => (
    room?.hostPlayerId === playerId
  ), [room])

  return {
    room,
    players,
    pendingPlayers,
    isHosting,
    startGame,
    deletePlayerAndUpdatePlayers,
  }
}