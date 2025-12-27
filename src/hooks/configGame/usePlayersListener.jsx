import { useEffect } from 'react'
import { supabase } from '../../services/supabaseClient'
import { fetchPlayers } from '../../services/fetch/fetchPlayers'

export function usePlayersListener(roomId, setPlayers) {
  useEffect(() => {
    if (!roomId) return

    const channel = supabase
      .channel(`players-room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `roomId=eq.${roomId}`,
        },
        async () => {
          const playersData = await fetchPlayers(roomId)
          setPlayers(playersData)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId, setPlayers])
}
