import { supabase } from "./supabaseClient"
import { v4 as uuidv4 } from 'uuid'

export const createPlayer = async (payload) => {
  try {
    const playerId = payload?.hostPlayerId ?? uuidv4()
    const response = await supabase
    .from('players')
    .insert([{
      name: payload.name,
      id: playerId,
      roomId: payload.id || payload?.roomId,
    }])

    localStorage.setItem('playerId', JSON.stringify(playerId))
    return response
  } catch (error) {
    return error
  }
}
