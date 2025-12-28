import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { Crew } from "../components/game/Crew";
import { Impostor } from "../components/game/Impostor";

import '../css/pages/game.css';
import { IMPOSTORS, PLAYERS } from "../utils/constants";

export default function Game() {
  const [playerSession, setPlayerSession] = useState(null)

  const navigate = useNavigate()
  const { roomId } = useParams()

  useEffect(() => {
    (async () => {
      const playerId = JSON.parse(localStorage.getItem('playerId'))
      if (!playerId) {
        navigate('/')
      }

      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('room_id', roomId)
        .eq('player_id', playerId)
        .single()

      if (error) {
        console.error('Error fetching game session:', error)
        return;
      }

      setPlayerSession(data)
    })()
  }, [roomId])

  return (
    <div>
      {playerSession?.role === PLAYERS && <Crew playerSession={playerSession} />}
      {playerSession?.role === IMPOSTORS && <Impostor playerSession={playerSession} />}
      <div className="players-order">
        <span className="players-order-title">Orden de la ronda:</span>
        {playerSession?.players.map((player, i) => (
          <span className={`${player?.id === playerSession?.player_id ? 'current-player' : 'rest-player'}`} key={player?.id}>({i + 1}) {player?.name}</span>
        ))}
      </div>
      <span
        className="back-home"
        onClick={() => navigate('/')}
      >
        Volver al inicio
      </span>
    </div>
  );
}