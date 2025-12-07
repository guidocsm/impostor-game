import { supabase } from "../supabaseClient";

export const fetchRoomByCode = async (code) => {
  const { data: room, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('code', code)
    .maybeSingle();
  return room
}