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

    const updateOnline = (state) => {
      const presenceIds = Object.values(state).flat().map(p => p.playerId);
      setPlayers(prev =>
        prev.map(player => ({
          ...player,
          online: presenceIds.includes(player.id),
        }))
      );
      return presenceIds;
    };

    const ensurePlayersSynced = async (state) => {
      const presenceIds = Object.values(state).flat().map(p => p.playerId);
      let missing = false;
      setPlayers(prev => {
        for (const pid of presenceIds) {
          if (!prev.find(p => p.id === pid)) {
            missing = true;
            break;
          }
        }
        return prev;
      });
      if (missing) {
        try {
          const fetched = await fetchPlayers(roomId);
          setPlayers(fetched.map(p => ({ ...p, online: presenceIds.includes(p.id) })));
        } catch (err) {
          console.error('Error fetching players to sync presence:', err);
        }
      }
    };

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      updateOnline(state);
    });

    channel.on('presence', { event: 'join' }, async () => {
      const state = channel.presenceState();
      updateOnline(state);
      await ensurePlayersSynced(state);
    });

    channel.on('presence', { event: 'leave' }, async () => {
      const state = channel.presenceState();
      updateOnline(state);

      if (isHosting) {
        try {
          const currentPlayers = await fetchPlayers(roomId);
          const onlineIds = Object.values(state).flat().map(p => p.playerId);
          const toDelete = currentPlayers.filter(p => !onlineIds.includes(p.id));
          for (const p of toDelete) {
            await supabase.from('players').delete().eq('id', p.id);
          }
          const refreshed = await fetchPlayers(roomId);
          setPlayers(refreshed.map(p => ({ ...p, online: onlineIds.includes(p.id) })));
        } catch (err) {
          console.error('Error handling leave cleanup:', err);
        }
      }
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ playerId, userId: playerId });
        const state = channel.presenceState();
        updateOnline(state);
        await ensurePlayersSynced(state);
      }
    });

    // 🔹 Detectar regreso a pestaña visible
    const handleVisibility = async () => {
      if (!document.hidden) {
        try {
          const playersData = await fetchPlayers(roomId);
          const state = channel.presenceState();
          const presenceIds = Object.values(state).flat().map(p => p.playerId);
          setPlayers(playersData.map(p => ({ ...p, online: presenceIds.includes(p.id) })));
        } catch (err) {
          console.error('Error syncing players on visibility change:', err);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      channel.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [roomId, playerId, isHosting, setPlayers]);
}
