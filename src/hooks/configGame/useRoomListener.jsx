import { useEffect } from "react";
import { supabase } from "../../services/supabaseClient";

export function useRoomListener(roomId, setRoom) {
  useEffect(() => {
    if (!roomId) return;

    const channel = supabase.channel(`room-listener:${roomId}`);

    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${roomId}`
      },
      payload => {
        setRoom(payload.new);
      }
    );

    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [roomId, setRoom]);
}
