import { supabase } from "./supabaseClient";

export async function createGameSession(gameSession) {
  const { error: insertError } = await supabase
    .from('game_sessions')
    .insert(gameSession)

  if (insertError) {
    console.error('Error creating game sessions:', insertError)
    return;
  }
}