import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { Crew } from "../components/game/Crew";
import { Impostor } from "../components/game/Impostor";

import '../css/pages/game.css';

export default function Game() {
  const [playerSession, setPlayerSession] = useState(null)

  const navigate = useNavigate()
  const { roomId } = useParams()

  useEffect(() => {
    const fetchPlayerSession = async () => {
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
    };

    fetchPlayerSession()
  }, [roomId])

  return (
    <div>
      <Crew playerSession={{}} />
      {playerSession?.role === 'tripulante' && <Crew playerSession={playerSession} />}
      {playerSession?.role === 'impostor' && <Impostor playerSession={playerSession} />}
      <span
        className="back-home"
        onClick={() => navigate('/')}
      >
        Volver al inicio
      </span>
    </div>
  );
}