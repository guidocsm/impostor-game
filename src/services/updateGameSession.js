import { supabase } from "./supabaseClient";

export async function updateGameSession(gameSession) {
  const { error: insertError } = await supabase
    .from('game_sessions')
    .upsert(gameSession, { onConflict: 'roomId' })

  if (insertError) {
    console.error('Error creating game sessions:', insertError)
    return;
  }
}