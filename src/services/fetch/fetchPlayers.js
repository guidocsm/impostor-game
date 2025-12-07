import { supabase } from "../supabaseClient";

export const fetchPlayers = async (roomId) => {
  const { data: players, error: errorPlayers } = await supabase
    .from("players")
    .select("*")
    .eq("roomId", roomId);

  return players
}