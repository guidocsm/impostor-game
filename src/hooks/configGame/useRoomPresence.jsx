import { useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { useParams } from "react-router-dom";
import { fetchPlayers } from "../../services/fetch/fetchPlayers";

export function useRoomPresence(isHosting, setPlayers) {
  const { roomId } = useParams()
  const playerId = JSON.parse(localStorage.getItem('playerId'))

  useEffect(() => {
    if (!roomId || !playerId) return

    const channel = supabase.channel(`room:${roomId}`, {
      config: { presence: { key: playerId } }
    })

    // Helper: actualiza el flag `online` en los players que ya tienes (desde la DB)
    const applyPresenceStateToPlayers = (presenceState) => {
      const presenceIds = Object.values(presenceState).flat().map(p => p.playerId)
      setPlayers(prev => prev.map(player => ({
        ...player,
        online: presenceIds.includes(player.id)
      })))
      return presenceIds // devuelve ids online actuales
    }

    // Helper: si hay presenceIds que no están en players, fetch desde DB para sincronizar
    const ensurePlayersAreSynced = async (presenceState) => {
      const presenceIds = Object.values(presenceState).flat().map(p => p.playerId)
      // comprobar si alguno de esos ids no está en el estado actual de players
      let missing = false
      setPlayers(prev => {
        // hacemos una pasada solo para detectar si falta alguno
        for (const pid of presenceIds) {
          if (!prev.find(pl => pl.id === pid)) {
            missing = true
            break
          }
        }
        return prev
      })

      if (missing) {
        // re-fetch completo y aplicar online flags basados en presenceState
        try {
          const fetched = await fetchPlayers(roomId)
          const normalized = (fetched || []).map(p => ({
            ...p,
            online: presenceIds.includes(p.id)
          }))
          setPlayers(normalized)
        } catch (err) {
          console.error('Error fetching players to sync presence:', err)
        }
      }
    }

    // SYNC: estado completo
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      applyPresenceStateToPlayers(state)
    })

    // JOIN: alguien (uno o varios) se une
    channel.on('presence', { event: 'join' }, async () => {
      // usamos presenceState para calcular online
      const state = channel.presenceState()
      applyPresenceStateToPlayers(state)
      // si algún player presente no estaba en la lista DB local, re-sincronizamos desde la DB
      await ensurePlayersAreSynced(state)
    })

    // LEAVE: alguien se va
    channel.on('presence', { event: 'leave' }, async () => {
      const state = channel.presenceState()
      applyPresenceStateToPlayers(state)

      // si eres host y quieres borrar players que se han ido físicamente:
      if (isHosting) {
        // leftPresences no lo usamos para mutar array, lo tratamos como petición de borrado en DB
        // Para mayor seguridad, mejor leer los left ids comparando state vs players previos.
        // Aquí hacemos un fetch para obtener la lista actual de players y borrar los que no están online:
        try {
          const currentPlayers = await fetchPlayers(roomId)
          const onlineIds = Object.values(state).flat().map(p => p.playerId)
          const toDelete = (currentPlayers || []).filter(p => !onlineIds.includes(p.id))
          for (const p of toDelete) {
            try {
              await supabase.from('players').delete().eq('id', p.id)
            } catch (err) {
              console.error('Error removing player:', err)
            }
          }
          // refrescar la lista después de borrados
          const refreshed = await fetchPlayers(roomId)
          setPlayers((refreshed || []).map(p => ({ ...p, online: onlineIds.includes(p.id) })))
        } catch (err) {
          console.error('Error handling leave cleanup:', err)
        }
      }
    })

    // Subscribe y trackear presencia
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        try {
          // Trackear inmediatamente al suscribirse
          await channel.track({ playerId, userId: playerId })

          // Después de trackear, sincronizar el estado de presencia con la lista DB actual.
          // Esto evita que la UI haga push de objetos de presence.
          const state = channel.presenceState()
          // Si puedes leer players ya cargados, aplicar online si no, intentar un fetch ligero
          setPlayers(prev => {
            if (prev && prev.length > 0) {
              const presenceIds = Object.values(state).flat().map(p => p.playerId)
              return prev.map(pl => ({ ...pl, online: presenceIds.includes(pl.id) }))
            }
            return prev
          })
          // Además, si al hacer presenceState detectamos ids que no están en prev, sincronizamos:
          await ensurePlayersAreSynced(state)
        } catch (err) {
          console.error('Error tracking presence or syncing after subscribe:', err)
        }
      }
    })

    return () => {
      try {
        channel.unsubscribe()
      } catch (err) {
        console.error('Error unsubscribing channel', err)
      }
    }
  }, [roomId, playerId, isHosting, setPlayers])
}
