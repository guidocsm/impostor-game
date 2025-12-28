import { supabase } from "./supabaseClient";

export async function deletePlayer() {
  const playerId = JSON.parse(localStorage.getItem('playerId'))
  
  return await supabase
    .from('players')
    .delete()
    .eq('id', playerId)
}