import { supabase } from "./supabaseClient"

export const createRoom = async (payload) => {
  function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code
  }

  try {
    // Crear usuario anónimo primero para obtener el auth.uid()
    const { data: { user }, error: authError } = await supabase.auth.signInAnonymously()
    if (authError) throw authError

    const hostPlayerId = user.id // Usar el ID de auth

    const response = await supabase
    .from('rooms')
    .insert([{
      players: payload.players,
      impostorsCount: payload.impostors,
      category: payload.category,
      hostPlayerId: hostPlayerId,
      code: generateRoomCode(),
    }])
    .select()

    return { ...response, hostPlayerId }
  } catch (error) {
    return error
  }
}
