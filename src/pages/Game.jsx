import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { Crew } from "../components/game/Crew";
import { Impostor } from "../components/game/Impostor";

import '../css/pages/game.css';
import { ROLES } from "../utils/constants";

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
      {playerSession?.role === ROLES.CREW && <Crew playerSession={playerSession} />}
      {playerSession?.role === ROLES.IMPOSTOR && <Impostor playerSession={playerSession} />}
      <span
        className="back-home"
        onClick={() => navigate('/')}
      >
        Volver al inicio
      </span>
    </div>
  );
}