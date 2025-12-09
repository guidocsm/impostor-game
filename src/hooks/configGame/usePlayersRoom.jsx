import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { fetchPlayers } from "../../services/fetch/fetchPlayers";

export function usePlayersRoom(room) {
  const [players, setPlayers] = useState([])

  const { roomId } = useParams()
  const navigate = useNavigate()
  const playerId = JSON.parse(localStorage.getItem('playerId'))

  const deletePlayer = async () => {
    await supabase
      .from('players')
      .delete()
      .eq('id', playerId)

    localStorage.removeItem('playerId')
    const players = await fetchPlayers(roomId)
    setPlayers(players)
    navigate('/')
  }

  const pendingPlayers = Array
    .from({ length: room?.totalPlayers - players?.length })
    .map(x => ({ placeholder: 'Esperando jugador' }))
  const isHosting = playerId === room?.hostPlayerId

  return {
    players,
    setPlayers,
    pendingPlayers,
    isHosting,
    deletePlayer
  }
}