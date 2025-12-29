import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { Crew } from "../components/game/Crew";
import { Impostor } from "../components/game/Impostor";

import '../css/pages/game.css';
import { IMPOSTORS, PLAYERS } from "../utils/constants";
import { Button } from "../components/ui/Button";
import { setRoomStatus } from "../services/setRoomStatus";

export default function Game() {
  const [playerSession, setPlayerSession] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const playerId = JSON.parse(localStorage.getItem('playerId'))

  const navigate = useNavigate()
  const { roomId } = useParams()

  useEffect(() => {
    (async () => {
      if (!playerId) {
        navigate('/')
      }

      await supabase
        .from('players')
        .update({ inLobby: false })
        .eq('id', playerId)

      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('roomId', roomId)
        .single()

      if (error) {
        console.error('Error fetching game session:', error)
        return;
      }

      setPlayerSession(data)
    })()
  }, [roomId])

  const backToLobby = async () => {
    setIsLoading(true)
    await setRoomStatus('waiting')
    setIsLoading(false)
    navigate(`/sala/${roomId}`)
  }

  const currentPlayer = playerSession?.players.find(player => player?.id === playerId)

  return (
    <main>
      {currentPlayer?.role === PLAYERS && <Crew playerSession={playerSession} />}
      {currentPlayer?.role === IMPOSTORS && <Impostor playerSession={playerSession} />}
      <div className="players-order">
        <span className="players-order-title">Orden de la ronda:</span>
        {playerSession?.players.map((player, i) => (
          <span className={`${player?.id === playerId ? 'current-player' : 'rest-player'}`} key={player?.id}>({i + 1}) {player?.name}</span>
        ))}
      </div>
      <section className="game-cta">
        <Button
          text="Volver a la sala"
          onClick={backToLobby}
          disabled={isLoading}
        />
        <span
          className="back-home"
          onClick={() => navigate('/')}
        >
          Salir
        </span>
      </section>
    </main>
  );
}