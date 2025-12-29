import { useEffect, useRef } from "react";
import { supabase } from "../../services/supabaseClient";
import { useParams } from "react-router-dom";
import { fetchPlayers } from "../../services/fetch/fetchPlayers";

export function useRoomPresence(setPlayers) {
  const { roomId } = useParams();
  const playerId = JSON.parse(localStorage.getItem('playerId'));
  const lastFetchRef = useRef(0);

  useEffect(() => {
    if (!roomId || !playerId) return

      ; (async () => {
        await supabase.rpc('set_config', {
          key: 'request.headers',
          value: JSON.stringify({ 'x-player-id': playerId })
        })
      })()

    const channel = supabase.channel(`room:${roomId}`, {
      config: { presence: { key: playerId } }
    });

    // Refetch players con debounce (máx 1 vez cada 500ms)
    const refetchPlayers = async () => {
      const now = Date.now()
      if (now - lastFetchRef.current < 500) return
      lastFetchRef.current = now

      const playersData = await fetchPlayers(roomId)
      const presenceState = channel.presenceState()
      const presenceIds = Object.values(presenceState).flat().map(p => p.playerId)

      setPlayers(playersData.map(player => ({
        ...player,
        online: presenceIds.includes(player.id)
      })))
    }

    // Cuando alguien se une o sale, refetch para obtener inLobby actualizado
    // Delay para dar tiempo a que el jugador actualice su inLobby
    channel.on('presence', { event: 'join' }, () => setTimeout(refetchPlayers, 300))
    channel.on('presence', { event: 'leave' }, refetchPlayers)

    // Subscribe y track
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ playerId, id: playerId })
      }
    });

    // Refetch al volver a la pestaña
    const handleVisibility = () => {
      if (!document.hidden) {
        refetchPlayers()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      channel.unsubscribe()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [roomId, playerId, setPlayers]);
}
