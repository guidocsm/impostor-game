import { supabase } from "./supabaseClient"

export const createPlayer = async (payload) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.signInAnonymously()
    if (authError) throw authError

    const playerId = payload?.hostPlayerId ?? user?.id

    await supabase
    .from('players')
    .insert([{
      name: payload.name,
      id: playerId,
      roomId: payload.id || payload?.roomId,
    }])

    localStorage.setItem('playerId', JSON.stringify(playerId))
    return user
  } catch (error) {
    return error
  }
}
