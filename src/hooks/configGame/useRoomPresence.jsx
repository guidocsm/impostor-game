import { useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { useParams } from "react-router-dom";
import { fetchPlayers } from "../../services/fetch/fetchPlayers";

export function useRoomPresence(isHosting, setPlayers) {
  const { roomId } = useParams();
  const playerId = JSON.parse(localStorage.getItem('playerId'));

  useEffect(() => {
    if (!roomId || !playerId) return;

    const channel = supabase.channel(`room:${roomId}`, {
      config: { presence: { key: playerId } }
    });

    // 🔹 Función para actualizar online/offline
    const updateOnline = (presenceState, currentPlayers) => {
      const presenceIds = Object.values(presenceState).flat().map(p => p.playerId);
      return currentPlayers.map(player => ({
        ...player,
        online: presenceIds.includes(player.id),
      }));
    };

    // 🔹 Fetch y sincronización completa de players
    const syncPlayers = async () => {
      try {
        const presenceState = channel.presenceState();
        const playersData = await fetchPlayers(roomId);

        // Evitamos duplicados: usamos player.id
        const uniquePlayers = playersData.filter(
          (p, index, self) => index === self.findIndex(x => x.id === p.id)
        );

        setPlayers(updateOnline(presenceState, uniquePlayers));
      } catch (err) {
        console.error('Error syncing players:', err);
      }
    };

    // 🔹 Eventos Presence
    channel.on('presence', { event: 'join' }, syncPlayers);
    channel.on('presence', { event: 'leave' }, syncPlayers);
    channel.on('presence', { event: 'sync' }, syncPlayers);

    // 🔹 Subscribe y track
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ playerId, userId: playerId });
        await syncPlayers(); // fetch inicial al subscribirse
      }
    });

    // 🔹 Refetch automático al volver a la pestaña
    const handleVisibility = async () => {
      if (!document.hidden) {
        await syncPlayers();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      channel.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [roomId, playerId, isHosting, setPlayers]);
}
