import { supabase } from "./supabaseClient"
import { v4 as uuidv4 } from 'uuid'

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
    const playerId = uuidv4()
    const response = await supabase
    .from('rooms')
    .insert([{
      crewCount: payload.crew,
      impostorsCount: payload.impostors,
      category: payload.category,
      hostPlayerId: playerId,
      code: generateRoomCode(),
      totalPlayers: payload.crew + payload.impostors
    }])
    .select()

    return response
  } catch (error) {
    return error
  }
}
