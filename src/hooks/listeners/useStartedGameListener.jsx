import { useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export function useStartedGameListener() {
  const { roomId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const channel = supabase
      .channel(`room-status-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`
        },
        (payload) => {

          if (payload.new?.status === 'started') {
            navigate(`/partida/${roomId}`);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to room updates');
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId, navigate])
}