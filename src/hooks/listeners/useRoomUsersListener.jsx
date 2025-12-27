import { useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { useParams } from "react-router-dom";
import { fetchPlayers } from "../../services/fetch/fetchPlayers";

export function useRoomUsersListener(onChangePlayers) {
  const { roomId } = useParams()

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
          onChangePlayers(dataPlayers)
        }
      )
      .subscribe((status) => {
        console.log('Players subscription status:', status);
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId])
}