import { supabase } from "../supabaseClient";

export const fetchRoomById = async (roomId) => {
  const { data: room, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', roomId)
    .single();

  return { room, error }
}