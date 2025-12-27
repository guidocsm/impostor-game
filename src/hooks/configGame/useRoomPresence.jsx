import { useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { useParams } from "react-router-dom";

export function useRoomPresence(isHosting, setPlayers) {
  const { roomId } = useParams()
  const playerId = JSON.parse(localStorage.getItem('playerId'))

  useEffect(() => {
    if (!roomId || !playerId) return

    const channel = supabase.channel(`room:${roomId}`, {
      config: { presence: { key: playerId } }
    })

    channel.on('presence', { event: 'join' }, ({ newPresences }) => {
      setPlayers(prevPlayers => {
        const playersCopy = [...prevPlayers];
        newPresences.forEach(player => {
          if (!playersCopy.find(x => x.playerId === player.playerId)) {
            playersCopy.push(player)
          }
        });
        return playersCopy
      });
    });

    channel.on('presence', { event: 'leave' }, async ({ leftPresences }) => {
      setPlayers(prevPlayers => prevPlayers.filter(player => !leftPresences.find(p => p.playerId === player.playerId)))

      if (isHosting) {
        for (const presence of leftPresences) {
          try {
            await supabase.from('players').delete().eq('id', presence.playerId)
          } catch (err) {
            console.error('Error removing player:', err)
          }
        }
      }
    });

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      setPlayers(prevPlayers => {
        const updatedPlayers = [...prevPlayers]
        Object.values(state).flat().forEach(player => {
          if (!updatedPlayers.find(p => p.playerId === player.playerId)) updatedPlayers.push(player)
        });
        return updatedPlayers
      });
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ playerId, userId: playerId })
      }
    })

    return () => channel.unsubscribe()
  }, [roomId, playerId, isHosting, setPlayers])
}
