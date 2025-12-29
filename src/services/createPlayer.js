import { supabase } from "./supabaseClient"

export const createPlayer = async (payload) => {
  try {
    // Si es host, ya tiene sesión del createRoom. Si no, crear una nueva.
    let userId = payload?.hostPlayerId
    
    if (!userId) {
      const { data: { user }, error: authError } = await supabase.auth.signInAnonymously()
      if (authError) throw authError
      userId = user?.id
    }

    await supabase
    .from('players')
    .insert([{
      name: payload.name,
      id: userId,
      roomId: payload.id || payload?.roomId,
    }])

    localStorage.setItem('playerId', JSON.stringify(userId))
    return { id: userId }
  } catch (error) {
    return error
  }
}
