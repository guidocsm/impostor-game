import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../../services/supabaseClient"
import { fetchRoomById } from "../../services/fetch/fetchRoomById"
import { usePlayersRoom } from "./usePlayersRoom"
import { fetchPlayers } from "../../services/fetch/fetchPlayers"

export function useRoomGame() {
  const [room, setRoom] = useState(null)
  const { roomId } = useParams()
  const navigate = useNavigate()

  const {
    players,
    setPlayers,
    pendingPlayers,
    isHosting,
    deletePlayer
  } = usePlayersRoom(room)

  useEffect(() => {
    (async () => {
      const roomData = await fetchRoomById(roomId)
      setRoom(roomData)

      const playersData = await fetchPlayers(roomId)
      setPlayers(playersData)
    })()
  }, [roomId])

  useEffect(() => {
    const channel = supabase
      .channel(`players-room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
        },
        async () => {
          const dataPlayers = await fetchPlayers(roomId)
          setPlayers(dataPlayers)
        }
      )
      .subscribe((status) => {
        console.log('Players subscription status:', status);
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId])

  useEffect(() => {
    const channel = supabase
      .channel(`room-status-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`
        },
        (payload) => {
          console.log('Room status update:', payload);

          if (payload.new?.status === 'started') {
            console.log('Redirecting to game...');
            navigate(`/partida/${roomId}`);
          }
        }
      )
      .subscribe((status) => {
        console.log('Room subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to room updates');
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId, navigate])

  const startGame = async () => {
    try {
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('options')
        .eq('id', room?.category?.id)
        .single();

      if (categoryError) {
        console.error('Error fetching category:', categoryError);
        return;
      }

      // 2. Seleccionar impostor y palabra secreta
      const impostorIndex = Math.floor(Math.random() * players.length)
      const secretWordIndex = Math.floor(Math.random() * category.options.length)
      const secretWord = category.options[secretWordIndex]

      // 3. Crear sesiones de juego
      const inserts = players.map((player, i) => ({
        player_id: player.id,
        player_name: player.name,
        role: i === impostorIndex ? 'impostor' : 'tripulante',
        word: secretWord,
        is_host: player.id === players[0].id,
        room_id: roomId,
      }))

      const { error: insertError } = await supabase
        .from('game_sessions')
        .insert(inserts)

      if (insertError) {
        console.error('Error creating game sessions:', insertError);
        return;
      }

      // 4. Actualizar estado de la sala
      const { data, error: updateError } = await supabase
        .from('rooms')
        .update({ status: 'started' })
        .eq('id', roomId)
        .select();

      if (updateError) {
        console.error('Error updating room status:', updateError);
        return;
      }

      navigate(`/partida/${roomId}`);

    } catch (error) {
      console.error('Error starting game:', error);
    }
  }

  return {
    room,
    players,
    pendingPlayers,
    isHosting,
    startGame,
    deletePlayer
  }
}